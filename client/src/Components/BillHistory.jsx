import { useState,useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, PencilIcon, DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline';
//import '../StyleSheets/BillHistory.css';
import axios from 'axios';


const TableContainer = styled.div`
  background: rgba(25, 25, 35, 0.95);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.1);
  overflow-x: auto;
`;

const FormTitle = styled.h2`
  color: #fff;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #fff;
`;

const TableHeader = styled.thead`
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
`;

const TableRow = styled(motion.tr)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.02);
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.1);
  }
`;

const TableHeaderCell = styled.th`
  padding: 1.5rem;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  
  &:hover {
    color: #6366f1;
  }
`;

const TableCell = styled.td`
  padding: 1.5rem;
  position: relative;
`;

const CategoryPill = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  background: rgba(99, 102, 241, 0.15);
  color: #6366f1;
  font-size: 0.9rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.5rem;
  margin: 0 0.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #6366f1;
    transform: scale(1.1);
  }
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.8rem 1.2rem;
  color: #fff;
  margin-bottom: 1.5rem;
  width: 300px;
`;

const PaymentHistoryTable = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'payment_date', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');

  
  const [paymentData, setBillHistory] = useState([]);

  const fetchBillHistory = () => {
    axios.get("http://localhost:5000/api/Bills/getBillHistory")
        .then(response => {
            // Assuming API returns an array of bill history objects
            const processedData = response.data.map(item => ({
                history_id: item.history_id,
                bill_name: item.billName,
                amount: item.amount,
                category: item.category,
                payment_date: item.paymentDate,
                vendor: item.vendor,
                referenceNumber: item.reference_number
            }));
            setBillHistory(processedData);
        })
        .catch(error => {
            console.error("Error fetching bill history:", error);
        });
};

  useEffect(() => {
    fetchBillHistory();
    }, []);




  const sortedData = [...paymentData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
  ))

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <TableContainer>

        <FormTitle>
            <h3>
            Bill History
            </h3>
        </FormTitle>
        
      <SearchInput
        type="text"
        placeholder="Search payments..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <StyledTable>
        <TableHeader>
          <tr>
            {['bill_name', 'amount', 'category', 'payment_date', 'vendor'].map((header) => (
              <TableHeaderCell key={header} onClick={() => requestSort(header)}>
                {header.replace('_', ' ').toUpperCase()}
                {sortConfig.key === header && (
                  sortConfig.direction === 'asc' ? <ArrowUpIcon width={16} /> : <ArrowDownIcon width={16} />
                )}
              </TableHeaderCell>
            ))}
          </tr>
        </TableHeader>
        <tbody>
          {filteredData.map((payment) => (
            <TableRow
              key={payment.history_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TableCell>{payment.bill_name}</TableCell>
              <TableCell>${payment.amount}</TableCell>
              <TableCell><CategoryPill>{payment.category}</CategoryPill></TableCell>
              <TableCell>
                        {new Date(payment.payment_date).toLocaleDateString("en-US", {
                            month: "long",  // Full month name, e.g., February
                            day: "numeric", // Day of the month, e.g., 4
                            year: "numeric" // Full year, e.g., 2025
                        })}
              </TableCell>
              <TableCell>{payment.vendor}</TableCell>
              {/* <TableCell>
                <ActionButton title="Edit">
                  <PencilIcon width={20} />
                </ActionButton>
                <ActionButton title="Copy">
                  <DocumentDuplicateIcon width={20} />
                </ActionButton>
                <ActionButton title="Delete">
                  <TrashIcon width={20} />
                </ActionButton>
              </TableCell> */}
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default PaymentHistoryTable;