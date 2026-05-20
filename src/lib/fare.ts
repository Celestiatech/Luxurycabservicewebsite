export type VehicleFareType = 'taxi' | 'van';

export type FareBreakdown = {
  vehicleType: VehicleFareType;
  vehicleQuantity: number;
  distanceKm: number;
  durationMinutes: number | null;
  baseFare: number;
  distanceRate: number;
  startingFare: number;
  distanceAmount: number;
  vehicleDiscountRate: number;
  vehicleDiscountAmount: number;
  longDistanceDiscountRate: number;
  longDistanceDiscountAmount: number;
  nightSurcharge: number;
  trafficSurcharge: number;
  total: number;
  description: string;
};

type FareTier = {
  max: number;
  rate: number;
  discount: number;
  description: string;
  fixed?: number;
};

const TAXI_TIERS: FareTier[] = [
  { max: 5, rate: 6.3, discount: 0.05, description: '1-5 km at $6.30/km, 5% off' },
  { max: 10, rate: 5.5, discount: 0.05, description: '5.1-10 km at $5.50/km, 5% off' },
  { max: 15, rate: 4.7, discount: 0.05, description: '10.1-15 km at $4.70/km, 5% off' },
  { max: 20, rate: 4.4, discount: 0.05, description: '15.1-20 km at $4.40/km, 5% off' },
  { max: 25, rate: 4.2, discount: 0.05, description: '20.1-25 km at $4.20/km, 5% off' },
  { max: 30, rate: 3.8, discount: 0.05, description: '25.1-30 km at $3.80/km, 5% off' },
  { max: 100, rate: 3.5, discount: 0.1, description: '30.1-100 km at $3.50/km, 10% off' },
  { max: Infinity, rate: 3.4, discount: 0.15, description: '100+ km at $3.40/km, 15% off' },
];

const VAN_TIERS: FareTier[] = [
  { max: 5, fixed: 60, rate: 0, discount: 0.05, description: '1-5 km fixed $60, 5% off' },
  { max: 10, rate: 8, discount: 0.05, description: '5.1-10 km at $8.00/km, 5% off' },
  { max: 15, rate: 7, discount: 0.05, description: '10.1-15 km at $7.00/km, 5% off' },
  { max: 20, rate: 5, discount: 0.05, description: '15.1-20 km at $5.00/km, 5% off' },
  { max: 25, rate: 4.7, discount: 0.05, description: '20.1-25 km at $4.70/km, 5% off' },
  { max: 30, rate: 4.4, discount: 0.05, description: '25.1-30 km at $4.40/km, 5% off' },
  { max: 100, rate: 4.2, discount: 0.1, description: '30.1-100 km at $4.20/km, 10% off' },
  { max: Infinity, rate: 4, discount: 0.1, description: '100+ km at $4.00/km, 10% off' },
];

const roundMoney = (amount: number) => Math.round(amount * 100) / 100;
const STARTING_FARE = 5;

export function parseDurationMinutes(durationText: string | null | undefined): number | null {
  if (!durationText) return null;
  const text = durationText.toLowerCase();
  let minutes = 0;
  const hourMatch = text.match(/([\d.]+)\s*(hour|hours|hr|hrs|h)\b/);
  const minuteMatch = text.match(/([\d.]+)\s*(min|mins|minute|minutes|m)\b/);
  if (hourMatch) minutes += Number(hourMatch[1]) * 60;
  if (minuteMatch) minutes += Number(minuteMatch[1]);
  return Number.isFinite(minutes) && minutes > 0 ? minutes : null;
}

export function isNightBooking(time: string | null | undefined) {
  if (!time) return false;
  const [hourRaw] = time.split(':');
  const hour = Number(hourRaw);
  return Number.isFinite(hour) && hour >= 0 && hour < 6;
}

export function calculateFare(input: {
  vehicleType: string;
  distanceKm: number | null | undefined;
  durationMinutes?: number | null;
  time?: string;
  vehicleQuantity?: number | null;
}): FareBreakdown | null {
  const distanceKm = Number(input.distanceKm);
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return null;
  const vehicleQuantityValue = Number(input.vehicleQuantity);
  const vehicleQuantity = Number.isFinite(vehicleQuantityValue) && vehicleQuantityValue > 0
    ? Math.max(1, Math.floor(vehicleQuantityValue))
    : 1;

  const vehicleType: VehicleFareType = input.vehicleType === 'van' ? 'van' : 'taxi';
  const tier = (vehicleType === 'van' ? VAN_TIERS : TAXI_TIERS).find((item) => distanceKm <= item.max);
  if (!tier) return null;

  const singleVehicleDistanceAmount = roundMoney(typeof tier.fixed === 'number' ? tier.fixed : distanceKm * tier.rate);
  const startingFare = roundMoney(STARTING_FARE * vehicleQuantity);
  const distanceAmount = roundMoney(singleVehicleDistanceAmount * vehicleQuantity);
  const vehicleDiscountAmount = roundMoney(distanceAmount * tier.discount);
  const baseFare = roundMoney(distanceAmount - vehicleDiscountAmount);
  const longDistanceDiscountRate = 0;
  const longDistanceDiscountAmount = 0;
  const nightSurcharge = isNightBooking(input.time) ? roundMoney(7 * vehicleQuantity) : 0;
  const trafficSurcharge = input.durationMinutes !== null && input.durationMinutes !== undefined && input.durationMinutes > 30
    ? roundMoney(20 * vehicleQuantity)
    : 0;
  const total = roundMoney(startingFare + baseFare + nightSurcharge + trafficSurcharge);

  return {
    vehicleType,
    vehicleQuantity,
    distanceKm,
    durationMinutes: input.durationMinutes ?? null,
    baseFare,
    distanceRate: tier.rate,
    startingFare,
    distanceAmount,
    vehicleDiscountRate: tier.discount,
    vehicleDiscountAmount,
    longDistanceDiscountRate,
    longDistanceDiscountAmount,
    nightSurcharge,
    trafficSurcharge,
    total,
    description: tier.description,
  };
}
