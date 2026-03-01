use anchor_lang::prelude::*;

// Global program-wide state.
#[account]
pub struct GlobalState {
    pub authority: Pubkey,         // 32
    pub total_voters: u64,         // 8
    pub total_votes_recorded: u64, // 8
    pub bump: u8,                  // 1
}

impl GlobalState {
    // 8 (discriminator) + 32 + 8 + 8 + 1 + 7 (padding)
    pub const SPACE: usize = 8 + 32 + 8 + 8 + 1 + 7;
}

// Per-voter profile tracking points, streaks, and last vote time.
#[account]
pub struct EngageProfile {
    pub voter: Pubkey,            // 32
    pub total_points: u64,        // 8
    pub vote_count: u64,          // 8
    pub current_streak: u32,      // 4
    pub longest_streak: u32,      // 4
    pub last_vote_timestamp: i64, // 8
    pub bump: u8,                 // 1
}

impl EngageProfile {
    // 8 (discriminator) + 32 + 8 + 8 + 4 + 4 + 8 + 1 + 3 (padding)
    pub const SPACE: usize = 8 + 32 + 8 + 8 + 4 + 4 + 8 + 1 + 3;
}

