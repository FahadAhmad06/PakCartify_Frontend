import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";


// creating order
export const createOrder=createAsyncThunk('order/createOrder',async(order,{rejectWithValue})=>{
    try{
        const config={
            headers:{
                'content-Type':'application/json'
            },
            withCredentials: true,
        }
        const {data}=await axios.post('/api/v1/new/order',order,config);
        
        return data
    }catch(error){
        
        return rejectWithValue(
            error.response?.data || "Order Creating failed.",
        );
    }
})

// ! get user order
export const getAllMyOrders=createAsyncThunk('order/getAllMyOrders',async(_,{rejectWithValue})=>{
    try{
        const {data}=await axios.get('/api/v1/order/user', { withCredentials: true })
        return data
    }catch(error){
        
        return rejectWithValue(
            error.response?.data || "Failed to ftch orders.",
        );
    }
})


// ! get order details
export const getOrderDetails=createAsyncThunk('order/getOrderDetail',async(orderID,{rejectWithValue})=>{
    try{
        const {data}=await axios.get(`/api/v1/order/${orderID}`, { withCredentials: true })
        return data
    }catch(error){
        
        return rejectWithValue(
            error.response?.data || "dailed to fetch order Details.",
        );
    }
})


// ! cancel user order (Processing only)
export const cancelMyOrder = createAsyncThunk('order/cancelMyOrder', async(orderId, {rejectWithValue}) => {
    try {
        const { data } = await axios.delete(`/api/v1/order/${orderId}`, { withCredentials: true });
        return { ...data, orderId };
    } catch (error) {
        return rejectWithValue(
            error.response?.data || "Failed to cancel order.",
        );
    }
})


const orderSlice=createSlice({
    name:'order',
    initialState:{
        success:false,
        loading:false,
        error:null,
        orders:[],
        order:{}
    },
    reducers:{
        removeErrors: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = null;
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(createOrder.pending,(state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(createOrder.fulfilled,(state,action)=>{
            state.loading=false,
            state.order=action.payload.order
            state.success=action.payload.order
        })
        .addCase(createOrder.rejected,(state,action)=>{
            state.loading = false,
            state.error =action.payload?.message ||"Failed to fetch orders."
        })

        // !Get all user order
        builder
        .addCase(getAllMyOrders.pending,(state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(getAllMyOrders.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders=action.payload.orders;
            // Do NOT set success here — it would trigger the OrderDetails
            // success-redirect effect and immediately navigate away from the details page
            state.success=null;
        })
        .addCase(getAllMyOrders.rejected,(state,action)=>{
            state.loading = false,
            state.error =action.payload?.message ||"Failed to fetch orders."
        })


        // !Get order Details
        builder
        .addCase(getOrderDetails.pending,(state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(getOrderDetails.fulfilled,(state,action)=>{
            state.loading=false;
            state.order=action.payload.order;
            // Do NOT set success here — this is a read operation, not a mutation
            state.success=null;
        })
        .addCase(getOrderDetails.rejected,(state,action)=>{
            state.loading = false,
            state.error =action.payload?.message ||"Failed to fetch order Details."
        })

        builder
        .addCase(cancelMyOrder.pending,(state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(cancelMyOrder.fulfilled,(state,action)=>{
            state.loading = false,
            state.orders = state.orders.filter(
                (order) => order._id !== action.payload.orderId,
            )
            state.success = action.payload.message
        })
        .addCase(cancelMyOrder.rejected,(state,action)=>{
            state.loading = false,
            state.error = action.payload?.message || "Failed to cancel order."
        })
    }
})

export const {removeErrors,removeSuccess}=orderSlice.actions
export default orderSlice.reducer