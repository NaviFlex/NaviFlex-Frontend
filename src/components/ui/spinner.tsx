import React from 'react';
import { Slab } from 'react-loading-indicators';

export const SpinnerComponent = () => {
    return (
        <div className="flex items-center justify-center h-full w-full rounded-[20px] bg-white">
            <Slab color="#5E52FF" size="medium" text="" textColor="#5E52FF" />
        </div>
    );
}