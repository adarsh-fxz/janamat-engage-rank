// Time-related constants.
pub const SECONDS_PER_DAY: i64 = 86_400;
// 48-hour window within which a streak stays alive.
pub const STREAK_GRACE_SECONDS: i64 = SECONDS_PER_DAY * 2;

// Points-related constants.
pub const BASE_VOTE_POINTS: u64 = 1;
// +1 point per streak day, capped by MAX_STREAK_BONUS.
pub const STREAK_BONUS_PER_DAY: u64 = 1;
pub const MAX_STREAK_BONUS: u64 = 2;

