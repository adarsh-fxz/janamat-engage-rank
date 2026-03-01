use anchor_lang::prelude::*;

use crate::{
    constants::*,
    errors::EngageError,
    events::PointsAwarded,
    state::{EngageProfile, GlobalState},
    AwardPoints,
};

// Handler for the award_points instruction.
pub fn award_points_handler(
    ctx: Context<AwardPoints>,
    poll_idx: u64,
    tx_signature: String,
    category: String,
) -> Result<()> {
    require!(tx_signature.len() <= 88, EngageError::SignatureTooLong);
    require!(category.len() <= 32, EngageError::CategoryTooLong);

    let profile: &mut Account<EngageProfile> = &mut ctx.accounts.engage_profile;
    let now = Clock::get()?.unix_timestamp;

    // Streak calculation
    let elapsed = now.saturating_sub(profile.last_vote_timestamp);
    if profile.last_vote_timestamp == 0 {
        // First-ever vote
        profile.current_streak = 1;
    } else if elapsed < SECONDS_PER_DAY {
        // Too soon: count the vote but do not award points or update streak.
        // The last_vote_timestamp stays unchanged so cooldown is based on last point-earning vote.
        profile.vote_count = profile
            .vote_count
            .checked_add(1)
            .ok_or(EngageError::Overflow)?;

        let state: &mut Account<GlobalState> = &mut ctx.accounts.global_state;
        state.total_votes_recorded = state
            .total_votes_recorded
            .checked_add(1)
            .ok_or(EngageError::Overflow)?;

        emit!(PointsAwarded {
            voter: profile.voter,
            poll_idx,
            points_earned: 0,
            total_points: profile.total_points,
            current_streak: profile.current_streak,
            tx_signature,
            category,
        });

        return Ok(());
    } else if elapsed >= SECONDS_PER_DAY && elapsed <= STREAK_GRACE_SECONDS {
        // Within 24–48 hour window — extend streak
        profile.current_streak = profile.current_streak.saturating_add(1);
    } else {
        // More than 48 hours later — reset streak but still award points
        profile.current_streak = 1;
    }

    if profile.current_streak > profile.longest_streak {
        profile.longest_streak = profile.current_streak;
    }
    profile.last_vote_timestamp = now;

    // Points calculation
    let streak_bonus = ((profile.current_streak.saturating_sub(1)) as u64)
        .saturating_mul(STREAK_BONUS_PER_DAY)
        .min(MAX_STREAK_BONUS);
    let points_earned: u64 = BASE_VOTE_POINTS + streak_bonus;

    profile.total_points = profile
        .total_points
        .checked_add(points_earned)
        .ok_or(EngageError::Overflow)?;
    profile.vote_count = profile
        .vote_count
        .checked_add(1)
        .ok_or(EngageError::Overflow)?;

    // Global counters
    let state: &mut Account<GlobalState> = &mut ctx.accounts.global_state;
    state.total_votes_recorded = state
        .total_votes_recorded
        .checked_add(1)
        .ok_or(EngageError::Overflow)?;

    emit!(PointsAwarded {
        voter: profile.voter,
        poll_idx,
        points_earned,
        total_points: profile.total_points,
        current_streak: profile.current_streak,
        tx_signature,
        category,
    });

    Ok(())
}
