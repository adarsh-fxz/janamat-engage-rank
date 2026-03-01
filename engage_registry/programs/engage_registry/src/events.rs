use anchor_lang::prelude::*;

// Emitted when GlobalState is first initialized.
#[event]
pub struct GlobalStateInitialized {
    pub authority: Pubkey,
}

// Emitted when a new EngageProfile is created for a voter.
#[event]
pub struct VoterRegistered {
    pub voter: Pubkey,
}

// Emitted whenever award_points is called (including the 0-point case within 24h).
#[event]
pub struct PointsAwarded {
    pub voter: Pubkey,
    pub poll_idx: u64,
    pub points_earned: u64,
    pub total_points: u64,
    pub current_streak: u32,
    pub tx_signature: String,
    pub category: String,
}

