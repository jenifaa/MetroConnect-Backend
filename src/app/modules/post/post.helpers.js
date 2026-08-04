import { Role } from "../user/user.model.js";

const isAdminRole = (role) =>
  role === Role.ADMIN || role === Role.SUPER_ADMIN;

const sanitizeUser = (user) => {
  if (!user) return null;
  const doc = user.toObject ? user.toObject() : user;
  return {
    _id: doc._id,
    name: doc.name,
    email: doc.email,
    picture: doc.picture,
  };
};

export const formatPostForViewer = (post, viewer) => {
  const role = viewer?.role;
  const userId = viewer?.userId?.toString();
  const raw = post.toObject ? post.toObject() : { ...post };

  const showAuthorIdentity =
    !raw.isAnonymous || isAdminRole(role) || raw.author?._id?.toString() === userId;

  if (!showAuthorIdentity) {
    raw.author = null;
    raw.isAuthorHidden = true;
  } else if (raw.author) {
    raw.author = sanitizeUser(raw.author);
  }

  raw.comments = (raw.comments || []).map((comment) => ({
    ...comment,
    user: sanitizeUser(comment.user),
  }));

  raw.reactions = (raw.reactions || []).map((reaction) => ({
    ...reaction,
    user: sanitizeUser(reaction.user),
  }));

  return raw;
};

export const formatPostsForViewer = (posts, viewer) =>
  posts.map((post) => formatPostForViewer(post, viewer));
