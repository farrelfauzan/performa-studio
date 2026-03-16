import { useState } from 'react'
import {
  Heart,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Send,
} from 'lucide-react'

import { useApiQuery } from '@/hooks/use-api'
import {
  fetchCommunityComments,
  type CommunityComment,
} from '@/lib/community-data'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// ─── Comment Card ───────────────────────────────────────────────────────

function CommentCard({
  comment,
  onDelete,
  onLove,
  onLike,
  onDislike,
}: {
  comment: CommunityComment
  onDelete: (id: number) => void
  onLove: (id: number) => void
  onLike: (id: number) => void
  onDislike: (id: number) => void
}) {
  const [replyText, setReplyText] = useState('')
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replies, setReplies] = useState(comment.replies)

  function handleSubmitReply() {
    if (!replyText.trim()) return
    setReplies((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: 'Performa',
        avatar: 'https://picsum.photos/seed/creator/40/40',
        content: replyText.trim(),
        timestamp: 'Just now',
        isCreator: true,
      },
    ])
    setReplyText('')
    setShowReplyInput(false)
  }

  return (
    <div className="space-y-3 rounded-xl border border-border/50 bg-card/30 p-4">
      <div className="flex items-start gap-3">
        <img
          src={comment.avatar}
          alt={comment.author}
          className="size-9 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{comment.author}</p>
            <span className="text-xs text-muted-foreground">
              {comment.timestamp}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground/60">
            on{' '}
            <span className="text-muted-foreground">
              {comment.contentTitle}
            </span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="mt-3 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 gap-1 px-2 text-xs ${comment.loved ? 'text-red-400' : 'text-muted-foreground'}`}
              onClick={() => onLove(comment.id)}
            >
              <Heart
                className={`size-3.5 ${comment.loved ? 'fill-red-400' : ''}`}
              />
              {comment.loved ? 'Loved' : 'Love'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-muted-foreground"
              onClick={() => onLike(comment.id)}
            >
              <ThumbsUp className="size-3.5" />
              {comment.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-muted-foreground"
              onClick={() => onDislike(comment.id)}
            >
              <ThumbsDown className="size-3.5" />
              {comment.dislikes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-muted-foreground"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              <MessageCircle className="size-3.5" />
              Reply
            </Button>

            <div className="ml-auto">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete comment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this comment by{' '}
                      <span className="font-medium">{comment.author}</span>?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => onDelete(comment.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Reply input */}
      {showReplyInput && (
        <div className="ml-12 flex items-center gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
            placeholder="Write a reply..."
            className="h-8 flex-1 rounded-lg border border-border/50 bg-card/50 px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
          />
          <Button
            size="sm"
            className="h-8 gap-1 px-3"
            onClick={handleSubmitReply}
            disabled={!replyText.trim()}
          >
            <Send className="size-3.5" />
            Send
          </Button>
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-12 space-y-3 border-l-2 border-border/30 pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-2.5">
              <img
                src={reply.avatar}
                alt={reply.author}
                className="size-7 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{reply.author}</p>
                  {reply.isCreator && (
                    <Badge className="h-4 bg-primary/15 px-1.5 text-[10px] text-primary border-transparent">
                      Creator
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {reply.timestamp}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Comments Section ───────────────────────────────────────────────────

function CommentsSkeleton() {
  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-border/50 bg-card/30 p-4"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
                <Skeleton className="h-2.5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-6 w-14 rounded" />
                  <Skeleton className="h-6 w-10 rounded" />
                  <Skeleton className="h-6 w-10 rounded" />
                  <Skeleton className="h-6 w-14 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function CommentsSection() {
  const { data, isLoading } = useApiQuery(
    'community-comments',
    fetchCommunityComments,
  )
  const [comments, setComments] = useState<CommunityComment[]>([])
  const [initialized, setInitialized] = useState(false)

  if (data && !initialized) {
    setComments(data)
    setInitialized(true)
  }

  function handleDelete(id: number) {
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  function handleLove(id: number) {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, loved: !c.loved } : c)),
    )
  }

  function handleLike(id: number) {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c)),
    )
  }

  function handleDislike(id: number) {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, dislikes: c.dislikes + 1 } : c)),
    )
  }

  if (isLoading) {
    return <CommentsSkeleton />
  }

  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Comments</CardTitle>
        <CardAction>
          <Badge variant="outline" className="text-xs">
            {comments.length} total
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onDelete={handleDelete}
            onLove={handleLove}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ))}
        {comments.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No comments yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
