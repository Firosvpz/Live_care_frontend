import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const UserVideoCall: React.FC = () => {
  const { roomId, userId } = useParams<{ roomId: string; userId: string }>();
  console.log("Room ID:", roomId, "User ID:", userId);

  const meetingContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const myMeeting = async (element: HTMLDivElement) => {
      const appID = 1572223889;
      const serverSecret = "832a54c883a6f1503064d8f1e27d27b0";

      if (!roomId || !userId) {
        console.error("Room ID is undefined");
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        userId,
        "user",
      );

      const zc = ZegoUIKitPrebuilt.create(kitToken);
      zc.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: false,
      });
    };

    if (meetingContainerRef.current) {
      myMeeting(meetingContainerRef.current);
    }
  }, [roomId, userId]);

  return <div ref={meetingContainerRef} />;
};

export default UserVideoCall;
