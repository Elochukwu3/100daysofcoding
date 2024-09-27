import * as fs from 'fs';
import * as path from 'path';
import { NigeriaState } from 'modules/interfaces/State';

const nigeriaData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../utils/nigeria.json'), 'utf-8')
);


export const getAllStates = ():NigeriaState[] => {
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
export const getStateByName = (stateName: string): any => {
  const state = nigeriaData.find((s: NigeriaState) => s.state.toLowerCase() === stateName.toLowerCase());
  
  if (!state) {
    throw new Error(`State ${stateName} not found`);
  }

  return {
    id: nigeriaData.findIndex((s: NigeriaState) => s.state.toLowerCase() === stateName.toLowerCase()) + 1,
    state: state.state,
    alias: state.alias,
    lgas: state.lgas.map((lga: string, lgaIndex: number) => ({
      id: lgaIndex + 1, 
      name: lga
    }))
  };
};
