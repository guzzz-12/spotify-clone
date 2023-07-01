import Stripe from "stripe";
import { Json } from "./supabase";

export interface UserDetails {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  billing_address: Json | null;
  payment_method: Stripe.PaymentMethod[Stripe.PaymentMethod.Type] | null;
  stripe_customer: string | null;
};

export interface Product {
  active: boolean;
  description: string | null;
  id: string;
  image: string | null;
  metadata: Json | null;
  name: string;
};

export interface Price {
  id: string;
  product_id: string;
  active?: boolean | null;
  description: string | null;
  unit_amount: number | null;
  currency: string;
  type: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval | null;
  interval_count?: number | null;
  trial_period_days?: number | null;
  metadata?: Json
};

export interface ProductsWithPrices extends Product {
  prices: Price[] | null;
};

export interface Subscription {
  id: string;
  user_id: string;
  status: Stripe.Subscription.Status | null;
  metadata: Json | null;
  price_id: string | null;
  quantity: number | null;
  cancel_at_period_end: boolean | null;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at: string | null;
  cancel_at: string | null;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  prices: Price | null;
};

export interface Song {
  id: number;
  author: string;
  image_url: string;
  song_path: string;
  title: string;
  user_id: string;
  created_at: string;
};