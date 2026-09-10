export type ProfileUser = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  memberSince: string;
  bio: string;
  preferredStyles: string[];
  preferredCities: string[];
  budgetBand: string;
};

export type BookingRow = {
  id: string;
  ref: string;
  status: "Upcoming" | "AwaitingPayment" | "Completed" | "Cancelled";
  cancelReason: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  createdAt: string;
  houseSlug: string;
  houseName: string;
  housePlace: string;
  houseKind: string;
  housePrice: number;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  amountSub: number;
  amountTax: number;
  amountTotal: number;
  hostName: string;
  hostAddress: string;
  hostPhone: string;
  hostEmail: string;
};
