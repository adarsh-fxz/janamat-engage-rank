use anchor_lang::prelude::*;

pub mod constants;
pub mod state;
pub mod events;
pub mod errors;
pub mod instructions;

use crate::errors::*;
use crate::state::*;

declare_id!("6bY93DBKnAct89SGYhNLwEukNpHm6QQ4zbwANVoWL3X9");

#[program]
pub mod engage_registry {
    use super::*;

    // Bootstrap the global state account (called once by authority).
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize_handler(ctx)
    }

    // Create a new EngageProfile PDA for a voter.
    // Anyone can call this for any pubkey (permissionless registration).
    pub fn register_voter(ctx: Context<RegisterVoter>, voter: Pubkey) -> Result<()> {
        instructions::register_voter_handler(ctx, voter)
    }

    // Award points to a voter after a confirmed on-chain vote.
    // Only the authority (our backend hot wallet) can call this.
    pub fn award_points(
        ctx: Context<AwardPoints>,
        poll_idx: u64,
        tx_signature: String,
        category: String,
    ) -> Result<()> {
        instructions::award_points_handler(ctx, poll_idx, tx_signature, category)
    }

    // Update authority (admin key rotation).
    pub fn update_authority(ctx: Context<UpdateAuthority>, new_authority: Pubkey) -> Result<()> {
        instructions::update_authority_handler(ctx, new_authority)
    }

    // Close a voter's EngageProfile PDA and reclaim rent.
    // Only the authority can call this — used for admin resets.
    pub fn close_profile(ctx: Context<CloseProfile>) -> Result<()> {
        instructions::close_profile_handler(ctx)
    }
}

// Accounts

// Accounts required for the `initialize` instruction.
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = GlobalState::SPACE,
        seeds = [b"global_state"],
        bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// Accounts required for the `register_voter` instruction.
// Creates a new EngageProfile PDA for the provided `voter` pubkey.
#[derive(Accounts)]
#[instruction(voter: Pubkey)]
pub struct RegisterVoter<'info> {
    #[account(
        init,
        payer = payer,
        space = EngageProfile::SPACE,
        seeds = [b"engage_profile", voter.as_ref()],
        bump
    )]
    pub engage_profile: Account<'info, EngageProfile>,

    #[account(
        mut,
        seeds = [b"global_state"],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// Accounts required for the `award_points` instruction.
// Reads and updates the existing EngageProfile and GlobalState PDAs.
#[derive(Accounts)]
#[instruction(poll_idx: u64, tx_signature: String, category: String)]
pub struct AwardPoints<'info> {
    #[account(
        mut,
        seeds = [b"engage_profile", engage_profile.voter.as_ref()],
        bump = engage_profile.bump
    )]
    pub engage_profile: Account<'info, EngageProfile>,

    #[account(
        mut,
        seeds = [b"global_state"],
        bump = global_state.bump,
        has_one = authority @ EngageError::Unauthorized
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

// Accounts required for the `update_authority` instruction.
// Only the current authority may change the GlobalState authority field.
#[derive(Accounts)]
pub struct UpdateAuthority<'info> {
    #[account(
        mut,
        seeds = [b"global_state"],
        bump = global_state.bump,
        has_one = authority @ EngageError::Unauthorized
    )]
    pub global_state: Account<'info, GlobalState>,

    pub authority: Signer<'info>,
}

// Accounts required for the `close_profile` instruction.
// Closes the EngageProfile PDA and sends its lamports to `authority`.
#[derive(Accounts)]
pub struct CloseProfile<'info> {
    #[account(
        mut,
        close = authority,
        seeds = [b"engage_profile", engage_profile.voter.as_ref()],
        bump = engage_profile.bump
    )]
    pub engage_profile: Account<'info, EngageProfile>,

    #[account(
        mut,
        seeds = [b"global_state"],
        bump = global_state.bump,
        has_one = authority @ EngageError::Unauthorized
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

