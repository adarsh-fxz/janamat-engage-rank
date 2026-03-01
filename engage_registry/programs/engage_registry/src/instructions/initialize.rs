use anchor_lang::prelude::*;

use crate::{events::GlobalStateInitialized, state::GlobalState, Initialize};

// Handler for the initialize instruction.
pub fn initialize_handler(ctx: Context<Initialize>) -> Result<()> {
    let state: &mut Account<GlobalState> = &mut ctx.accounts.global_state;
    state.authority = ctx.accounts.authority.key();
    state.total_voters = 0;
    state.total_votes_recorded = 0;
    state.bump = ctx.bumps.global_state;

    emit!(GlobalStateInitialized {
        authority: state.authority,
    });

    Ok(())
}

