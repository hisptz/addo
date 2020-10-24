export interface TableActionOption {
  id: string;
  actionCode: string;
  name: string;
  icon?: string;
  needConfirmation?: boolean;
  confirmationType?: string;
  confirmationText?: string;
}
