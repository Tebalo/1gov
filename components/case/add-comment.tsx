'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AlertCircle, Loader2, MessageCircleDashedIcon, PlusCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserInfo } from '@/lib/audit-trail-service';
import { useComments } from '@/lib/hooks/useComments';
import { getAccessGroups } from '@/app/auth/auth';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Badge } from '../ui/badge';

interface AddCommentProps {
  caseId: string;
  caseType: string;
  currentUser: UserInfo;
  onCommentAdded?: () => void;
  className?: string;
  placeholder?: string;
  buttonText?: string;
  autoFocus?: boolean;
}

export function AddComment({
  caseId,
  caseType,
  currentUser,
  onCommentAdded,
  className = '',
  placeholder = 'Add a comment...',
  buttonText = 'Add Comment',
  autoFocus = false
}: AddCommentProps) {
  const [commentText, setCommentText] = useState('');
  const { addComment, loading, error } = useComments();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      await addComment(caseId, caseType, currentUser, commentText);
      setCommentText('');
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      // Call the callback if provided
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      // Error is already handled by the hook
      console.error('Failed to add comment:', err);
    }
  };

  return (
    <Card className={`shadow-sm border-none`}>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-4">
          {error && (
            <Alert variant="destructive" className="mb-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {showSuccessMessage && (
            <Alert variant="default" className="mb-3 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>Comment added successfully</AlertDescription>
            </Alert>
          )}
          
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px] resize-y"
            disabled={loading}
            autoFocus={autoFocus}
            aria-label="Comment text"
          />
        </CardContent>
        
        <CardFooter className="flex justify-between items-center px-4 pb-3">
          <div className="text-xs text-gray-500">
            {commentText.length > 0 && (
              <span>
                {commentText.length} character{commentText.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={loading || !commentText.trim()}
            className=""
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {buttonText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// CommentSection component that combines the comment input and display
interface CommentSectionProps {
  caseId: string;
  caseType: string;
  currentUser?: UserInfo;
  className?: string;
}

export function CommentSection({
  caseId,
  caseType,
//   currentUser,
  className = ''
}: CommentSectionProps) {
  const { fetchComments, loading, error } = useComments();
  const [comments, setComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserInfo>({
    name: '',
    role: '',
    id: '',
  });
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const profile = await getAccessGroups();
        if (profile && profile.current) {  // Add null check
            setCurrentUser(prev => ({
            ...prev,
            name: profile.username || '',
            role: profile.current.toLowerCase() || '',
            id: profile.userid || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    initializeUser();
  }, []);
  console.log(currentUser)
  // Function to load comments
  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const data = await fetchComments(caseId, caseType);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Load comments on initial render
  React.useEffect(() => {
    loadComments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, caseType]);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="border-b">
            <div className='flex justify-between'>
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                        <MessageCircleDashedIcon/>
                    </div>
                    <h2 className="font-semibold text-lg text-foreground">
                    Comments
                    </h2>
                </div>
                <div className='flex items-center gap-3'>
                    <div>
                        {comments.length > 0 && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={loadComments}
                                disabled={isLoadingComments}
                            >
                                {isLoadingComments ? (
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : null}
                                Refresh
                            </Button>
                        )}
                    </div>
                    <div>
                        <Dialog >
                            <DialogTrigger asChild>
                                <Button variant="outline" className='gap-1'><PlusCircle/>Add Comment</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add Comment</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details below to add a comment to the case.
                                    </DialogDescription>
                                </DialogHeader>
                                <AddComment
                                    caseId={caseId}
                                    caseType={caseType}
                                    currentUser={currentUser}
                                    onCommentAdded={loadComments}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </CardHeader>   
        <CardContent className="p-4">
        <div className={`grid grid-cols-1 gap-6`}>
            <div className={`space-y-4 ${className}`}>

            {isLoadingComments ? (
                <div className="py-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-3">
                {comments.map((comment) => (
                    <Card key={comment.id} className="shadow-sm">
                    <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{comment.userName}</div>
                            <Badge variant={'outline'}>{comment.userRole}</Badge>
                            <div className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                            </div>
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap">{comment.content}</div>
                        
                    </CardContent>
                    </Card>
                ))}
                </div>
            ) : (
                <Card className="shadow-sm bg-gray-50">
                    <CardContent className="py-6 text-center text-gray-500">
                        No comments yet. Be the first to add a comment.
                    </CardContent>
                </Card>
            )}
        </div>
        </div>
        </CardContent>
    </Card>
  );
}
