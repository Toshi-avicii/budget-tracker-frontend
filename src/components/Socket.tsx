'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { getSocket } from '@/lib/socket';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { CircleUserRound, CornerUpLeft, CornerUpRight, MessageSquare, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAppSelector } from '@/store/reduxHooks';
import clsx from 'clsx';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useQuery } from '@tanstack/react-query';
import { getConversation } from '@/lib/helpers';
import Loader from './Loader';

type ChatUser = { id: string; name: string; socketId: string; };
type ChatMsg = {
    _id: string;
    from: {
        id: string;
        name: string;
    },
    message: string;
    to: {
        id: string;
        name: string;
    };
    createdAt: Date;
    replyMessage?: {
        id: string;
        message: string;
        to: string;
        from: string;
    },
    replyFrom?: string;
    replyTo?: string;
}

type ReplyMsg = {
    name: string | null,
    msg: string | null,
    id: string | null,
    replyMessage?: {
        id: string,
        message: string,
        to: string,
        from: string
    }
}

interface ChatMessagesProps {
    messages: ChatMsg[];
    setIsDragging: React.Dispatch<React.SetStateAction<{ left: boolean, right: boolean, dragId: null | string, createdAt?: string }>>;
    setSelectedMsg: React.Dispatch<React.SetStateAction<ReplyMsg>>;
    isDragging: { left: boolean, right: boolean, dragId: null | string, createdAt?: string };
    selectedUserForChat: ChatUser | null;
}

interface ChatInputProps {
    message: string;
    setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    sendPrivateMessage: () => void;
}

interface MessageProps {
    msg: ChatMsg;
    setIsDragging: React.Dispatch<React.SetStateAction<{ left: boolean, right: boolean, dragId: null | string, createdAt?: string }>>;
    setSelectedMsg: React.Dispatch<React.SetStateAction<ReplyMsg>>;
    isDragging: { left: boolean, right: boolean, dragId: null | string, createdAt?: string };
    selectedUserForChat: ChatUser | null;
}

const ChatMessages = memo(function ChatMessages({ messages, setIsDragging, setSelectedMsg, isDragging, selectedUserForChat }: ChatMessagesProps) {
    return (selectedUserForChat && messages.length > 0) ? messages.map((msg) => {
        return (
            (msg.from.id === selectedUserForChat?.id || msg.to.id === selectedUserForChat?.id) && (
                <Message
                    isDragging={isDragging}
                    msg={msg}
                    selectedUserForChat={selectedUserForChat}
                    setIsDragging={setIsDragging}
                    setSelectedMsg={setSelectedMsg}
                />
            )
        )
    }) : <div className='flex justify-center items-center'>No user Selected</div>
})

const ChatInput = memo(function ChatInput({ message, setIsTyping, setMessage, sendPrivateMessage }: ChatInputProps) {
    return (
        <div className='flex items-center'>
            <Input
                value={message}
                onChange={(e) => {
                    setIsTyping(true);
                    setMessage(e.target.value)
                }}
                onBlur={() => {
                    setIsTyping(false);
                }}
                placeholder="Type message"
                className='focus:outline-none focus-visible:ring-0 p-0 border-none'
            />
            <Button
                className='p-0 m-0 rounded-md h-6 w-8 flex justify-center items-center'
                onClick={sendPrivateMessage}
            >
                <Send size={14} />
            </Button>
        </div>
    )
})

const Message = memo(function Message({ msg, setIsDragging, setSelectedMsg, isDragging }: MessageProps) {
    const profile = useAppSelector(state => state.profile);
    const date = new Date(msg.createdAt);
    const timeFormat = new Intl.DateTimeFormat('en-UK', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date);
    return (
        <motion.div
            key={msg._id}
            data-id={msg.createdAt.toString()}
            initial={{ opacity: 0, scale: 0, transformOrigin: '100% 100%' }}
            animate={{ opacity: 1, scale: 1, transformOrigin: '100% 100%' }}
            transition={{
                duration: 0.5,
                ease: 'easeIn'
            }}
            drag="x"
            dragElastic={0.28}
            dragConstraints={{
                right: 0,
                left: 0
            }}
            onDragStart={(evt, info) => {
                const target = evt.target as HTMLElement;
                const id = target.dataset.id;
                if (info.offset.x > 0 && id === msg.createdAt.toString()) {
                    setIsDragging({
                        right: true,
                        left: false,
                        dragId: msg.from.id,
                        createdAt: msg.createdAt.toString()
                    });
                }
                if (info.offset.x < 0 && id === msg.createdAt.toString()) {
                    setIsDragging({
                        right: false,
                        left: true,
                        dragId: msg.from.id,
                        createdAt: msg.createdAt.toString()
                    })
                }
            }}
            onDragEnd={() => {
                setSelectedMsg({
                    msg: msg.message,
                    name: msg.from.name,
                    id: msg._id,
                    replyMessage: {
                        id: msg._id,
                        message: msg.message,
                        from: msg.from.id,
                        to: msg.to.id
                    }
                })
                setIsDragging({
                    left: false,
                    right: false,
                    dragId: null
                })
            }}
            exit={{ opacity: 0, scale: 0, transformOrigin: '100% 100%' }}
            className={clsx("my-3 rounded-lg text-xs p-1 cursor-grab", (msg.from.name === profile.username) ? 'place-self-end bg-blue-500' : 'place-self-start bg-pink-600')}
        >
            {
                msg.replyMessage?.id && ((msg.replyMessage.from === msg.from.id || msg.replyMessage.to === msg.to.id) || (msg.replyMessage.to === msg.from.id || msg.replyMessage.from === msg.to.id)) && (
                    <div className='border-l-[6px] border-l-pink-600 rounded-lg bg-blue-950 p-2'>
                        <p>{msg?.replyFrom === profile.username ? 'You' : msg.replyFrom}</p>
                        <p>{msg.replyMessage.message}</p>
                    </div>
                )
            }
            <motion.li
                className={clsx('text-white text-xs px-2 md:text-sm md:px-3 py-2 w-auto max-w-24 lg:max-w-none text-wrap md:w-fit flex justify-between flex-col items-center relative')}
                data-id={msg.createdAt.toString()}
            >
                <span className='self-start' data-id={msg.createdAt}>{msg.message}</span>
                <span className='text-xs self-end' data-id={msg.createdAt}>{timeFormat}</span>

                {
                    (isDragging.right && msg.createdAt.toString() === isDragging?.createdAt) && (
                        <motion.div
                            initial={{ left: -112 }}
                            animate={{ left: -70 }}
                            className='absolute -left-28'
                        >
                            <CornerUpLeft />
                        </motion.div>
                    )
                }
                {
                    (isDragging.left && msg.createdAt.toString() === isDragging?.createdAt) && <motion.div
                        initial={{ right: -112 }}
                        animate={{ right: -70 }}
                        // transition={{ ease: 'anticipate', duration: 1 }}
                        className='absolute -right-28'
                    >
                        <CornerUpRight />
                    </motion.div>
                }
            </motion.li>
        </motion.div>
    )
})

export default function ChatBox() {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const profile = useAppSelector(state => state.profile);
    const token = useAppSelector(state => state.auth.token);
    const [message, setMessage] = useState('');
    const [received, setReceived] = useState<ChatMsg[]>([]);
    const [selectedUserForChat, setSelectedUserForChat] = useState<ChatUser | null>(null);
    const [connectedUsers, setConnectedUsers] = useState<ChatUser[]>([]);
    const [allUsers, setAllUsers] = useState<ChatUser[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isDragging, setIsDragging] = useState<{ left: boolean, right: boolean, dragId: null | string, createdAt?: string }>({
        left: false,
        right: false,
        dragId: null,
        createdAt: undefined
    });
    const [selectedMsg, setSelectedMsg] = useState<ReplyMsg>({
        name: null,
        msg: null,
        id: null,
        replyMessage: {
            id: '',
            message: '',
            to: '',
            from: ''
        }
    });

    const messageQuery = useQuery({
        queryKey: ['get-conversation', profile.username, selectedUserForChat?.name],
        queryFn: async ({ queryKey }) => {
            const [, loginUserName, targetUsername] = queryKey;
            const loginUser = allUsers.find(user => user.name === loginUserName);
            const targetUser = allUsers.find(user => user.name === targetUsername);
            if (loginUser && targetUser) {
                return await getConversation({ token, user1: loginUser.id, user2: targetUser.id });
            }
            return null;
        },

        enabled: !!selectedUserForChat,
    });

    const errorCountRef = useRef(0); // Persisted error counter

    useEffect(() => {
        const socket = getSocket(token);
        let hasStoppedTrying = false;
        socket.connect();

        const handleConnect = () => {
            toast.success(`Connected to socket, id: ${socket.id}`);
            socket.emit('init', profile.username); // IMPORTANT
        };

        const handleConnectError = () => {
            errorCountRef.current += 1;
            toast.error(`Socket connection failed (${errorCountRef.current}/3)`);

            if (errorCountRef.current >= 3 && !hasStoppedTrying) {
                toast.error('Socket connection failed 3 times. Stopping further attempts.');
                socket.disconnect();
                hasStoppedTrying = true;
            }
        };

        const handleClientsList = (users: Array<ChatUser>) => {
            const allUsersExceptLoginPerson = users.filter(user => user.name !== profile.username);
            setConnectedUsers(allUsersExceptLoginPerson);
            if (Array.isArray(users)) {
                setAllUsers(users);
            }
        };

        const handleMessage = (msg: ChatMsg) => {
            if (msg) {
                setReceived(prev => [...prev, msg]);
            }
        };

        const handleReceiveMessage = ({ from, message, to, replyMessage, replyFrom, replyTo, id }: {
            from: { id: string, name: string },
            message: string,
            to: { id: string; name: string }
            id: string,
            replyTo?: string,
            replyFrom?: string,
            replyMessage?: {
                id: string;
                message: string;
                to: string;
                from: string;
            }
        }) => {
            setReceived(prev => {
                const baseMsg = {
                    from: { id: from.id, name: from.name },
                    message,
                    to: { id: to.id, name: to.name },
                    createdAt: new Date(),
                    _id: id
                };
                if (replyMessage) {
                    return [...prev, { ...baseMsg, replyMessage, replyFrom, replyTo, _id: replyMessage.id }];
                }
                return [...prev, baseMsg];
            });
        };

        socket.on('connect', handleConnect);
        socket.on('connect_error', handleConnectError);
        socket.on('clients-list', handleClientsList);
        socket.on('message', handleMessage);
        socket.on('chat-message', data => console.log('Received chat-message', data));
        socket.on('receive-message', handleReceiveMessage);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('connect_error', handleConnectError);
            socket.off('clients-list', handleClientsList);
            socket.off('message', handleMessage);
            socket.off('chat-message');
            socket.off('receive-message', handleReceiveMessage);
            socket.disconnect();
        };
    }, []);


    useEffect(() => {
        if (messageQuery.isSuccess && messageQuery.data?.data) {
            setReceived(messageQuery.data.data.data);
        } else if (messageQuery.isError) {
            setReceived([])
        }
    }, [messageQuery.data, messageQuery.isSuccess, messageQuery.isError]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageQuery])

    const sendPrivateMessage = () => {
        if (message.length === 0) {
            toast.info("Message cannot be empty");
            return;
        }

        const socket = getSocket(token);
        const loginUser = allUsers.find(user => user.name === profile.username);
        const targetUser = allUsers.find(user => user.name === selectedUserForChat?.name);
        if (loginUser && targetUser) {
            if (selectedMsg) {
                socket.emit('private-message', {
                    from: loginUser.id,
                    to: targetUser.id,
                    message,
                    socketId: socket.id,
                    reply: selectedMsg.id
                });
            } else {
                socket.emit('private-message', {
                    from: loginUser.id,
                    to: targetUser.id,
                    message,
                    socketId: socket.id
                });
            }
            setSelectedMsg({
                msg: null,
                id: null,
                name: null
            })
        } else {
            toast.error('Could not send message');
        }
        setMessage('');
    };

    return (
        <Sheet>
            <div className='relative'>
                <SheetTrigger asChild
                    className='fixed right-8 bottom-8 rounded-full bg-blue-500 text-white w-12 h-12 cursor-pointer hover:bg-blue-600'
                >
                    <Button>
                        <MessageSquare size={28} />
                    </Button>
                </SheetTrigger>
                <SheetContent className='flex flex-col lg:min-w-[1000px] w-full p-0'>
                    <div className='flex h-full'>
                        <div className='flex-1 border-2'>
                            <p className='p-4 bg-blue-900 text-sm lg:text-normal'>Connected Users</p>
                            {
                                connectedUsers.length > 0 && connectedUsers.map((user) => {
                                    return (
                                        <div
                                            key={user.id}
                                            onClick={() => setSelectedUserForChat(user)}
                                            className={clsx('p-4 border-b cursor-pointer hover:bg-blue-600 text-sm lg:text-fw-normal', (user.name === selectedUserForChat?.name && 'bg-blue-800'))}
                                        >
                                            {user.name}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='flex-[3] flex flex-col'>
                            <div className='flex-[9] p-0 overflow-auto'>
                                <div className='p-4 border-b-2 dark:bg-slate-900 bg-slate-100'>
                                    <div>
                                        {
                                            selectedUserForChat ?
                                                <p className='flex gap-x-3'>
                                                    <CircleUserRound />
                                                    {selectedUserForChat.name}
                                                </p> :
                                                "Send Message"
                                        }
                                    </div>
                                </div>
                                <ul className='overflow-y-auto scrollbar-thin scrollbar-track-bg-transparent scrollbar-thumb-blue-700 p-4 flex flex-col overflow-x-hidden'>
                                    <AnimatePresence initial={false}>
                                        {
                                            (messageQuery.isLoading && !messageQuery.isSuccess) && <div className='flex justify-center items-center'>
                                                <Loader />
                                            </div>
                                        }
                                        <ChatMessages
                                            isDragging={isDragging}
                                            messages={received}
                                            selectedUserForChat={selectedUserForChat}
                                            setIsDragging={setIsDragging}
                                            setSelectedMsg={setSelectedMsg}
                                        />
                                        {
                                            isTyping &&
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0, transformOrigin: '100% 100%' }}
                                                animate={{ opacity: 1, scale: 1, transformOrigin: '100% 100%' }}
                                                transition={{
                                                    duration: 0.5,
                                                    ease: 'easeIn'
                                                }}
                                                className="mb-3 rounded-lg text-xs p-2 bg-blue-600 w-fit"
                                            >
                                                Typing...
                                            </motion.div>
                                        }

                                        <div ref={bottomRef} />
                                    </AnimatePresence>
                                </ul>
                            </div>
                            <div className='flex-1 flex items-end p-4'>
                                <motion.div
                                    style={{
                                        borderRight: '1px solid #6b7280',
                                        borderTop: '1px solid #6b7280',
                                        borderBottom: '1px solid #6b7280',
                                        borderLeft: selectedMsg.msg ? '7px solid dodgerblue' : '1px solid #6b7280',
                                        transition: 'border-left 0.5s ease'
                                    }}
                                    transition={{ ease: 'anticipate', duration: 0.5 }}
                                    className="border border-gray-500 pl-4 pr-2 rounded-md flex flex-col py-0 w-full"
                                >
                                    <AnimatePresence initial={false}>
                                        {
                                            selectedMsg.msg && (
                                                <motion.div className='relative'>
                                                    <h1 className=''>{selectedMsg.name === profile.username ? "You" : selectedMsg.name}</h1>
                                                    <p>{selectedMsg.msg}</p>
                                                    <button
                                                        className='absolute top-2 right-2'
                                                        onClick={() => setSelectedMsg({
                                                            msg: null,
                                                            name: null,
                                                            id: null
                                                        })}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </motion.div>
                                            )
                                        }
                                    </AnimatePresence>
                                    <ChatInput
                                        message={message}
                                        sendPrivateMessage={sendPrivateMessage}
                                        setIsTyping={setIsTyping}
                                        setMessage={setMessage}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </div>
        </Sheet>
    );
}

