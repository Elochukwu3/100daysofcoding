import * as fs from 'fs';
import * as path from 'path';


const nigeriaData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../utils/nigeria.json'), 'utf-8')
);


export const getAllStates = () => {
  return nigeriaData.map((state: any, index: number) => ({
    id: index + 1, 
    state: state.state,
    alias: state.alias,
    lgas: state.lgas.map((lga: string, lgaIndex: number) => ({
      id: lgaIndex + 1, 
      name: lga
    }))
  }));
};


export const getStateById = (id: number) => {
  const state = nigeriaData[id - 1];
  if (!state) return null;
  return {
    id: id,
    state: state.state,
    alias: state.alias,
    lgas: state.lgas.map((lga: string, lgaIndex: number) => ({
      id: lgaIndex + 1,
      name: lga
    }))
  };
};
