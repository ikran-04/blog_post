import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPost = async (req, res) => {
  try {
    const { authorId, content } = req.body;
    const image = req.file;
    console.log(image);
    const newPost = await prisma.post.create({
      data: {
        content: content,
        images: image.filename,
        author: {
          connect: { id: parseInt(authorId) },
        },
      },
    });

    console.log("New post created:", newPost);
    res.status(200).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Internal server Error");
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    const postsWithUserInfo = allPosts.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      images: post.images,
      author: {
        id: post.author.id,
        username: post.author.username,
      },
      likes: post.likes,
    }));

    res.status(200).json(postsWithUserInfo);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const likePost = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const like = await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    res.json(like);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const unlikePost = async (req, res) => {
  const { userId, postId } = req.params;

  try {
    await prisma.like.deleteMany({
      where: {
        userId: parseInt(userId, 10),
        postId: parseInt(postId, 10),
      },
    });

    res.json({ message: "Successfully unliked the post." });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const countLikes = async (req, res) => {
  const { postId } = req.params;

  try {
    const likeCount = await prisma.like.count({
      where: {
        postId: parseInt(postId, 10),
      },
    });

    res.json({ count: likeCount });
  } catch (error) {
    console.error("Error counting likes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkIfLiked = async (req, res) => {
  const { userId, postId } = req.params;

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: parseInt(userId, 10),
        postId: parseInt(postId, 10),
      },
    });

    res.json({ hasLiked: !!existingLike });
  } catch (error) {
    console.error("Error checking like:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
