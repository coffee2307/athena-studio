export type LeadRecord={id:string;name:string;email:string;message:string;createdAt:string};
export interface LeadRepository{
 create(input:Omit<LeadRecord,"id"|"createdAt">):Promise<LeadRecord>;
 findById(id:string):Promise<LeadRecord|null>;
}
