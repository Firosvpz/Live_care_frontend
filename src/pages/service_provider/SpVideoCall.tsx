import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const ProviderVideoCall: React.FC = () => {
    const { roomId, serviceProviderId } = useParams<{
        roomId: string;
        serviceProviderId: string;
    }>();

    const meetingContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const myMeeting = async (element: HTMLDivElement) => {
            const appID = 1572223889;
            const serverSecret = "832a54c883a6f1503064d8f1e27d27b0";
            // Check if roomId and serviceProviderId are available
            if (!roomId || !serviceProviderId) {
                console.error("Room ID or Service Provider ID is undefined");
                return;
            }

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomId,
                serviceProviderId,
                "service-provider"
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
    }, [roomId, serviceProviderId]);

    return <div ref={meetingContainerRef} />;
};

export default ProviderVideoCall;