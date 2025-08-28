import { createComment } from "../services/comment/create-comment.js"
import { createReplyOnComment } from "../services/comment/create-reply.js"
import { softDeleteOneComment } from "../services/comment/delete-one-comment.js"
import { getCommentById } from "../services/comment/get-comment-byId.js"
import { getCommentReply } from "../services/comment/get-comment-reply.js"
import { getComment } from "../services/comment/get-comment.js"
import { getReplyNested } from "../services/comment/get-reply-nested.js"
import { updateCommentWithAuthor } from "../services/comment/update-comment-byId.js"

async function createCommentOnSpeech(req, res, next) {
  try {
    const content = req.body.content
    const author = req.user
    const parentSpeech = req.body.speechId
    const path = []

    if (!content && typeof content !== "string") {
      const error = new Error("Content invalid")
      error.status = 400
      throw error
    }

    const result = await createComment(content, author, parentSpeech, path)

    res.status(201).json({ message: "Published", comment: result })
  } catch (error) {
    next(error)
  }
}

async function createReply(req, res, next) {
  try {
    const commentId = req.body.commentId
    const content = req.body.content
    const author = req.user
    const parentSpeech = req.body.speechId
    const path = req.body.path

    if (!content && typeof content !== "string") {
      const error = new Error("Content invalid")
      error.status = 400
      throw error
    }

    const result = await createReplyOnComment(
      commentId,
      content,
      author,
      parentSpeech,
      path
    )

    res.status(201).json({ message: "Published", reply: result })
  } catch (error) {
    next(error)
  }
}

async function getCommentOnSpeech(req, res, next) {
  try {
    const parentSpeech = req.params.id
    const sortType = req.query.sortType

    const comment = await getComment(parentSpeech)

    if (sortType === "oldest") {
      comment.sort((a, b) => {
        const firstComment = new Date(a.createdAt)
        const secondComment = new Date(b.createdAt)

        if (firstComment < secondComment) {
          return -1
        }

        if (firstComment > secondComment) {
          return 1
        }

        return 0
      })
    }

    if (sortType === "newest") {
      comment.sort((a, b) => {
        const firstComment = new Date(a.createdAt)
        const secondComment = new Date(b.createdAt)

        if (firstComment < secondComment) {
          return 1
        }

        if (firstComment > secondComment) {
          return -1
        }

        return 0
      })
    }

    res.status(200).json(comment)
  } catch (error) {
    next(error)
  }
}

async function getDetailComment(req, res, next) {
  try {
    const commentId = req.params.id

    const comment = await getCommentById(commentId)
    if (!comment) {
      const error = new Error("Comment is not existed")
      error.status = 404
      throw error
    }

    res.status(200).json(comment)
  } catch (error) {
    next(error)
  }
}

async function getReplyOnComment(req, res, next) {
  try {
    const commentId = req.params.commentId
    const parentSpeech = req.params.speechId
    const sortType = req.query.sortType

    const reply = await getCommentReply(parentSpeech, commentId)

    if (sortType === "oldest") {
      reply.sort((a, b) => {
        const firstReply = new Date(a.createdAt)
        const secondReply = new Date(b.createdAt)

        if (firstReply < secondReply) {
          return -1
        }

        if (firstReply > secondReply) {
          return 1
        }

        return 0
      })
    }

    if (sortType === "newest") {
      reply.sort((a, b) => {
        const firstReply = new Date(a.createdAt)
        const secondReply = new Date(b.createdAt)

        if (firstReply < secondReply) {
          return 1
        }

        if (firstReply > secondReply) {
          return -1
        }

        return 0
      })
    }

    res.status(200).json(reply)
  } catch (error) {
    next(error)
  }
}

async function getReplyCommentNested(req, res, next) {
  try {
    const commentId = req.params.id

    const reply = await getReplyNested(commentId)

    res.status(200).json(reply)
  } catch (error) {
    next(error)
  }
}

async function updateComment(req, res, next) {
  try {
    const commentId = req.params.id
    const content = req.body.content
    const author = req.user

    if (!content && typeof content !== "string") {
      const error = new Error("Content invalid")
      error.status = 400
      throw error
    }

    const updated = await updateCommentWithAuthor(content, commentId, author)

    res.status(200).json(updated)
  } catch (error) {
    next(error)
  }
}

async function softDeleteComment(req, res, next) {
  try {
    const commentId = req.params?.id
    const author = req.user

    const deleted = await softDeleteOneComment(commentId, author)

    res.status(200).json(deleted)
  } catch (error) {
    next(error)
  }
}

export {
  createCommentOnSpeech,
  createReply,
  getCommentOnSpeech,
  getDetailComment,
  getReplyOnComment,
  getReplyCommentNested,
  updateComment,
  softDeleteComment,
}
