"use client";

import { IEvent } from '@/lib/database/models/event.model';
import CheckoutButton from './CheckoutButton';

type CardButtonProps = {
  event: IEvent;
};

const CardButton = ({ event }: CardButtonProps) => {
  return <CheckoutButton event={event} variant="card" />;
};

export default CardButton;
