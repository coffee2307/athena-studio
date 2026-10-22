export type ContentEntry={id:string;slug:string;title:string;body:string;publishedAt:string|null};
export interface ContentRepository{
 findPublishedBySlug(slug:string):Promise<ContentEntry|null>;
 listPublished(limit:number,cursor?:string):Promise<{items:ContentEntry[];nextCursor:string|null}>;
}
