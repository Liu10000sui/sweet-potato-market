const KNOWN_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않아요.",
  "User already registered": "이미 가입된 이메일이에요.",
  "Password should be at least 6 characters":
    "비밀번호는 6자 이상이어야 해요.",
  "Email not confirmed": "이메일 인증이 필요해요. 메일함을 확인해주세요.",
  "Unable to validate email address: invalid format":
    "이메일 형식이 올바르지 않아요.",
  "New password should be different from the old password.":
    "새 비밀번호는 기존 비밀번호와 달라야 해요.",
};

export function translateAuthError(message: string): string {
  return KNOWN_MESSAGES[message] ?? message;
}
