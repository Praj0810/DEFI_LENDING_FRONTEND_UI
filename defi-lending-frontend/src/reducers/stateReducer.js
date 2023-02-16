import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    EINRAbi:'',
    EGoldAbi:'',
    LendingPoolAbi:'',
    LPTokenAbi:'',
    EINRContractAddress:'',
    EGOLDContractAddress:'',
    LendingContractAddress:'',
    LPTokenAddress:''
};

const tokenReducer = createSlice({
    name : "AbiState",
    initialState,
    reducers: {
        updateABI:(state,action)=>{
            state.EINRAbi = action.payload.EINRAbi
            state.EGoldAbi = action.payload.EGoldAbi;
            state.LendingPoolAbi = action.payload.LendingPoolAbi;
            state.LPTokenAbi = action.payload.LPTokenAbi;
            state.EINRContractAddress = action.payload.EINRContractAddress;
            state.EGOLDContractAddress = action.payload.EGOLDContractAddress;
            state.LendingContractAddress = action.payload.LendingContractAddress;
            state.LPTokenAddress = action.payload.LPTokenAddress;
        }
    },
    
});

export const { updateABI } = tokenReducer.actions;

export default tokenReducer.reducer;
