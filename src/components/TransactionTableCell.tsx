'use client'

import { Transaction } from '@/app/(common)/transactions/types';
import { Row } from '@tanstack/react-table';
import React, { useState } from 'react'

interface TransactionTableCellProps {
    row: Row<Transaction>
}

function TransactionTableCell({ row }: TransactionTableCellProps) {
    const description = row.getValue('description') as string;
    const [isFullTextView, setIsFullTextView] = useState(false);
    if (description.length <= 20) {
        return <div>{description}</div>
    }

    if (description.length > 20) {
        if (isFullTextView) return <div className="cursor-pointer max-w-40" onClick={() => setIsFullTextView(false)}>{description}</div>
        else return <div className="cursor-pointer max-w-40" onClick={() => setIsFullTextView(true)}>{description.slice(0, 20)} ...</div>
    }
}

export default TransactionTableCell