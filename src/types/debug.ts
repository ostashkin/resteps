export interface DebugProps {
  id: string;
  order?: number;
  value: any;
  isActive: boolean;
  isTouched: boolean;
  isOpen: boolean;
  isPending: boolean;
  isConfirmed: boolean;
  isFailed: boolean;
  rerenderStatus: number;
}
