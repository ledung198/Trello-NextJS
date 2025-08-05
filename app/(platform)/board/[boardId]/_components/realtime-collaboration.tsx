"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  Users, 
  Activity, 
  MousePointer2, 
  Wifi, 
  WifiOff,
  Eye,
  MessageCircle,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { realtimeService, User, Cursor, BoardActivity } from "@/lib/realtime";

interface LiveCursorProps {
  cursor: Cursor;
  user: User;
}

const LiveCursor = ({ cursor, user }: LiveCursorProps) => {
  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-100"
      style={{
        left: cursor.x,
        top: cursor.y,
        transform: 'translate(-2px, -2px)'
      }}
    >
      <div className="flex items-center gap-1">
        <MousePointer2 
          className="h-4 w-4" 
          style={{ color: user.color }}
          fill={user.color}
        />
        <div 
          className="px-2 py-1 rounded-md text-xs text-white font-medium whitespace-nowrap"
          style={{ backgroundColor: user.color }}
        >
          {user.name}
        </div>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  activity: BoardActivity;
  user?: User;
}

const ActivityItem = ({ activity, user }: ActivityItemProps) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'card_created':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'card_moved':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'card_updated':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'list_created':
        return <div className="w-2 h-2 bg-purple-500 rounded-full" />;
      case 'user_joined':
        return <div className="w-2 h-2 bg-green-400 rounded-full" />;
      case 'user_left':
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const getActivityText = () => {
    const userName = user?.name || 'Someone';
    switch (activity.type) {
      case 'card_created':
        return `${userName} created "${activity.data.cardTitle}"`;
      case 'card_moved':
        return `${userName} moved a card from ${activity.data.fromList} to ${activity.data.toList}`;
      case 'card_updated':
        return `${userName} updated a card`;
      case 'list_created':
        return `${userName} created a new list`;
      case 'user_joined':
        return `${userName} joined the board`;
      case 'user_left':
        return `${userName} left the board`;
      default:
        return `${userName} performed an action`;
    }
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
      <div className="mt-2">
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          {getActivityText()}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <Clock className="h-3 w-3" />
          {timeAgo(activity.timestamp)}
        </p>
      </div>
    </div>
  );
};

export const RealtimeCollaboration = () => {
  const params = useParams();
  const { user } = useUser();
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [activities, setActivities] = useState<BoardActivity[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !params.boardId) return;

    const currentUser: User = {
      id: user.id,
      name: user.fullName || user.firstName || 'Anonymous',
      avatar: user.imageUrl,
      color: '#3B82F6' // Default blue color
    };

    // Connect to real-time service
    realtimeService.connect(params.boardId as string, currentUser);
    setIsConnected(true);

    // Set up event listeners
    realtimeService.onUserJoined((newUser) => {
      setOnlineUsers(prev => [...prev.filter(u => u.id !== newUser.id), newUser]);
    });

    realtimeService.onUserLeft((userId) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== userId));
      setCursors(prev => prev.filter(c => c.userId !== userId));
    });

    realtimeService.onCursorMove((cursor) => {
      setCursors(prev => [
        ...prev.filter(c => c.userId !== cursor.userId),
        cursor
      ]);
    });

    realtimeService.onBoardActivity((activity) => {
      setActivities(prev => [activity, ...prev.slice(0, 19)]); // Keep last 20 activities
    });

    realtimeService.onConnectionChange(setIsConnected);

    // Track mouse movements
    const handleMouseMove = (e: MouseEvent) => {
      if (boardRef.current?.contains(e.target as Node)) {
        realtimeService.broadcastCursorMove(e.clientX, e.clientY);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      realtimeService.disconnect();
    };
  }, [user, params.boardId]);

  // Get user info for activities
  const getUserForActivity = (userId: string) => {
    return onlineUsers.find(u => u.id === userId);
  };

  return (
    <>
      {/* Live Cursors */}
      {cursors.map((cursor) => {
        const cursorUser = onlineUsers.find(u => u.id === cursor.userId);
        if (!cursorUser || cursor.userId === user?.id) return null;
        
        return (
          <LiveCursor 
            key={cursor.userId} 
            cursor={cursor} 
            user={cursorUser} 
          />
        );
      })}

      {/* Collaboration Panel */}
      <div className="fixed top-20 right-4 z-40 space-y-4">
        {/* Connection Status & Online Users */}
        <Card className="w-80 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              Live Collaboration
              <Badge variant="outline" className="ml-auto">
                {onlineUsers.length} online
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users className="h-3 w-3" />
                Online now
              </div>
              <div className="flex flex-wrap gap-2">
                {onlineUsers.map((onlineUser) => (
                  <div 
                    key={onlineUser.id}
                    className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1"
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: onlineUser.color }}
                    />
                    <span className="text-xs font-medium truncate max-w-20">
                      {onlineUser.id === user?.id ? 'You' : onlineUser.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowActivity(!showActivity)}
              className="w-full justify-start text-xs"
            >
              <Activity className="h-3 w-3 mr-2" />
              {showActivity ? 'Hide' : 'Show'} Activity Feed
              {activities.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {activities.length}
                </Badge>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        {showActivity && (
          <Card className="w-80 shadow-lg bg-white/95 backdrop-blur-sm max-h-96 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 max-h-80 overflow-y-auto">
              {activities.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {activities.map((activity, index) => (
                    <ActivityItem
                      key={`${activity.timestamp}-${index}`}
                      activity={activity}
                      user={getUserForActivity(activity.userId)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Board Reference for Mouse Tracking */}
      <div ref={boardRef} className="fixed inset-0 pointer-events-none" />
    </>
  );
};