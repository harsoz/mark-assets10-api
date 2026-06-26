import { Multer } from 'multer';

// simple dto as type
export type FilesDTO = {
  MainPicture?: Express.Multer.File;
  Galery?: Express.Multer.File[]
  Files?: Express.Multer.File[];
};
