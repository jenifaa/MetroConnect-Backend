import { Role } from "../user/user.model.js";

const isComplaintManager = (role) =>
  role === Role.ADMIN || role === Role.SUPER_ADMIN;

export const formatComplainForViewer = (complaint, viewer) => {
  const raw = complaint.toObject ? complaint.toObject() : { ...complaint };
  const viewerId = viewer?.userId?.toString();
  const isOwner = raw.submittedBy?._id?.toString() === viewerId;

  if (raw.isAnonymous && !isComplaintManager(viewer?.role) && !isOwner) {
    raw.submittedBy = null;
    raw.isSubmitterHidden = true;
  } else if (raw.submittedBy) {
    const submitter = raw.submittedBy;
    raw.submittedBy = {
      _id: submitter._id,
      name: submitter.name,
      email: submitter.email,
      picture: submitter.picture,
    };
  }

  return raw;
};

export const formatComplaintsForViewer = (complaints, viewer) =>
  complaints.map((item) => formatComplainForViewer(item, viewer));
