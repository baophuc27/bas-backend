export interface BaseAttributes {

  createdBy?: string | null;
  updatedBy?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
