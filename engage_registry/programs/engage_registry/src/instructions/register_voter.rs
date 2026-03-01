use anchor_lang::prelude::*;

use crate::{
    errors::EngageError,
    events::VoterRegistered,
    state::{EngageProfile, GlobalState},
    RegisterVoter,
};

// Handler for the register_voter instruction.
pub fn register_voter_handler(
    ctx: Context<RegisterVoter>,
    voter: Pubkey,
) -> Result<()> {
    let profile: &mut Account<EngageProfile> = &mut ctx.accounts.engage_profile;
    profile.voter = voter;
    profile.total_points = 0;
    profile.vote_count = 0;
    profile.current_streak = 0;
    profile.longest_streak = 0;
    profile.last_vote_timestamp = 0;
    profile.bump = ctx.bumps.engage_profile;

    let state: &mut Account<GlobalState> = &mut ctx.accounts.global_state;
    state.total_voters = state
        .total_voters
        .checked_add(1)
        .ok_or(EngageError::Overflow)?;

    emit!(VoterRegistered { voter });
    Ok(())
}

