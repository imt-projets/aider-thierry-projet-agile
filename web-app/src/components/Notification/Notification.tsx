import { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
	message: string;
	type: NotificationType;
	onClose: () => void;
	duration?: number;
}

export const Notification = ({
    message,
    type,
    onClose,
    duration = 3000
} : NotificationProps) => {
	useEffect(() => {
		const timer = setTimeout(() => {
		onClose();
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	return (
		<div className={`notification notification-${type}`}>
			<p className="notification-message">{message}</p>
			<button className="notification-close" onClick={onClose}>
				×
			</button>
		</div>
	);
}; 