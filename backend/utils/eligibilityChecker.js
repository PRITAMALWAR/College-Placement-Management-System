const eligibilityChecker = (
  student,
  drive
) => {
  // Check CGPA
  if (student.cgpa < drive.minimumCGPA) {
    return {
      eligible: false,
      reason: `Minimum CGPA required is ${drive.minimumCGPA}`,
    };
  }

  // Check Branch
  if (
    drive.eligibleBranches.length > 0 &&
    !drive.eligibleBranches.includes(
      student.branch
    )
  ) {
    return {
      eligible: false,
      reason: "Branch not eligible",
    };
  }

  // Check Skills
  if (
    drive.requiredSkills &&
    drive.requiredSkills.length > 0
  ) {
    const studentSkills = student.skills.map(
      (skill) => skill.toLowerCase()
    );

    const missingSkills =
      drive.requiredSkills.filter(
        (skill) =>
          !studentSkills.includes(
            skill.toLowerCase()
          )
      );

    if (missingSkills.length > 0) {
      return {
        eligible: false,
        reason: `Missing skills: ${missingSkills.join(
          ", "
        )}`,
      };
    }
  }

  return {
    eligible: true,
    reason: "Eligible",
  };
};

export default eligibilityChecker;