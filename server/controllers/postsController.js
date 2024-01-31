import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPost = async (req, res) => {
  try {
    const { authorId, content } = req.body;

    // Use Prisma to create a new post
    const newPost = await prisma.post.create({
      data: {
        content: content,
        author: {
          connect: { id: authorId }, // Connect the post to the author by their ID
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
    // const allPosts = await prisma.post.findMany({
    //   orderBy: { createdAt: "desc" },
    // });
    // res.status(200).json(allPosts);

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

    // Extract relevant information for response
    const postsWithUserInfo = allPosts.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      author: {
        id: post.author.id,
        username: post.author.username,
      },
      likes: post.likes, // Include likes if needed
    }));

    res.status(200).json(postsWithUserInfo);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Internal Server Error");
  }
};
