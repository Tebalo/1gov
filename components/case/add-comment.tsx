'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AlertCircle, Loader2, MessageCircleDashed, MessageCircleDashedIcon, MessageCircleIcon, PlusCircle, RefreshCw } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
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
import { Avatar, AvatarFallback } from '../ui/avatar';

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

interface CommentSectionProps {
  caseId: string;
  caseType: string;
  currentUser?: UserInfo;
  className?: string;
}

interface CaseComment {  
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  userName: string;
  userRole?: string;
}

export function CommentSection({
  caseId,
  caseType,
  className = ''
}: CommentSectionProps) {
  const { fetchComments, loading, error } = useComments();
  const [comments, setComments] = useState<CaseComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [hasNewComments, setHasNewComments] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [currentUser, setCurrentUser] = useState<UserInfo>({
    name: '',
    role: '',
    id: '',
  });

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const profile = await getAccessGroups();
        if (profile && profile.current) {
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

  // Function to load comments
  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const data = await fetchComments(caseId, caseType);
      
      // Sort comments to show newest first
      const sortedComments = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setComments(sortedComments);
      setLastRefresh(new Date());
      setHasNewComments(false);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Handle comment added callback
  const handleCommentAdded = async () => {
    await loadComments();
    setHasNewComments(true);
  };

  // Load comments on initial render
  useEffect(() => {
    loadComments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, caseType]);

  // Function to get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to get avatar background color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-cyan-500'
    ];
    
    // Simple hash function to pick a consistent color for each name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Format date for comments
  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Today at ${format(date, 'h:mm a')}`;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    }
    
    // If within the last week, show relative time
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    if (date > oneWeekAgo) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // Otherwise show the full date
    return format(date, 'MMM d, yyyy • h:mm a');
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b bg-gray-50/50">
        <div className='flex justify-between'>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
              <MessageCircleIcon />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-foreground">
                Comments
              </h2>
              <p className="text-xs text-muted-foreground">
                {comments.length} comment{comments.length !== 1 ? 's' : ''}
                {comments.length > 0 && ` • Last updated ${formatDistanceToNow(lastRefresh, { addSuffix: true })}`}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div>
              {comments.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadComments}
                  disabled={isLoadingComments}
                  className="gap-1.5"
                >
                  {isLoadingComments ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  Refresh
                </Button>
              )}
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className='gap-1.5'>
                    <PlusCircle className="h-4 w-4" />
                    Add Comment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
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
                    onCommentAdded={handleCommentAdded}
                    autoFocus={true}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardHeader>   
      <CardContent className="p-0">
        {isLoadingComments && comments.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-muted-foreground">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          <div className="divide-y">
            {comments.map((comment, index) => {
              const isNew = hasNewComments && index === 0;
              const avatarColor = getAvatarColor(comment.userName);
              
              return (
                <div 
                  key={comment.id} 
                  className={`p-4 transition-colors ${isNew ? 'bg-blue-50/50 animate-pulse' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex gap-3">
                    <Avatar className={`h-9 w-9 ${avatarColor} text-black`}>
                      <AvatarFallback>
                        {getInitials(comment.userName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{comment.userName}</span>
                          {comment.userRole && (
                            <Badge variant="outline" className="rounded-sm text-xs font-normal">
                              {comment.userRole}
                            </Badge>
                          )}
                          {isNew && (
                            <Badge className="bg-blue-500 text-xs">New</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 sm:mt-0">
                          {formatCommentDate(comment.createdAt)}
                        </span>
                      </div>
                      
                      <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <MessageCircleDashed className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No comments yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Be the first to add a comment to this case. Comments help track important information and decisions.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add the first comment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
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
                  onCommentAdded={handleCommentAdded}
                  autoFocus={true}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
