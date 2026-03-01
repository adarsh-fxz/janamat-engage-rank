use anchor_lang::prelude::*;

// Custom errors for the engage_registry program.
#[error_code]
pub enum EngageError {
    #[msg("Only the authority can perform this action")]
    Unauthorized,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Transaction signature is too long (max 88 chars)")]
    SignatureTooLong,
    #[msg("Category string is too long (max 32 chars)")]
    CategoryTooLong,
    #[msg("Cannot vote again within 24 hours of last vote")]
    VotedTooSoon,
}

