export const getProfileCompletion = (profile) => {
  if (!profile) return { percent: 0, verified: false };

  let requiredFields = [
    profile.name,
    profile.email,
    profile.phoneNumber,
    profile.location,
  ];

  // Worker-specific fields
  if (profile.role === "WORKER") {
    requiredFields = requiredFields.concat([
      profile.skills?.length > 0,
      profile.categories?.length > 0,
      profile.experience,
      profile.about,
      profile.age,
    ]);
  }

  const total = requiredFields.length;
  const completed = requiredFields.filter(Boolean).length;

  const percent = Math.round((completed / total) * 100);
  const verified = percent === 100;

  return { percent, verified };
};
