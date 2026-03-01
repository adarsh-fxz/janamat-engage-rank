use anchor_lang::prelude::*;

use crate::{state::GlobalState, CloseProfile, UpdateAuthority};

// Handler for updating the authority in GlobalState.
pub fn update_authority_handler(
    ctx: Context<UpdateAuthority>,
    new_authority: Pubkey,
) -> Result<()> {
    let state: &mut Account<GlobalState> = &mut ctx.accounts.global_state;
    state.authority = new_authority;
    Ok(())
}

// Handler for closing a voter's EngageProfile and reclaiming rent.
//The `close = authority` constraint in CloseProfile handles zeroing the account and returning lamports to the authority.
pub fn close_profile_handler(ctx: Context<CloseProfile>) -> Result<()> {
    let state: &mut Account<GlobalState> = &mut ctx.accounts.global_state;
    state.total_voters = state.total_voters.saturating_sub(1);
    Ok(())
}

