import styled from 'styled-components';

export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

export const Header = styled.header`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  padding: 32px;
  text-align: center;
`;

export const Title = styled.h1`
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
`;

export const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin-top: 8px;
`;

export const Content = styled.main`
  padding: 32px;
`;

export const Form = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 14px 18px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background: var(--gray-100);
    cursor: not-allowed;
  }

  &::placeholder {
    color: var(--gray-500);
  }
`;

export const Button = styled.button`
  padding: 14px 28px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ErrorAlert = styled.div`
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
  color: var(--danger);
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  animation: fadeInUp 0.3s ease-out;
`;

export const SectionTitle = styled.h2`
  color: var(--gray-700);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TaskItem = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${props => props.$completed
    ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
    : 'var(--gray-50)'};
  border: 1px solid ${props => props.$completed ? '#bbf7d0' : 'var(--gray-200)'};
  border-radius: 12px;
  transition: all 0.2s ease;
  animation: fadeInUp 0.3s ease-out;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const TaskContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const TaskIcon = styled.span<{ $completed: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: ${props => props.$completed ? 'var(--success)' : 'var(--gray-300)'};
  color: white;
  transition: all 0.2s ease;
`;

export const TaskTitle = styled.span<{ $completed: boolean }>`
  font-size: 16px;
  color: ${props => props.$completed ? 'var(--gray-500)' : 'var(--gray-700)'};
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
`;

export const Badge = styled.span<{ $variant: 'success' | 'warning' }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.$variant === 'success'
    ? 'linear-gradient(135deg, var(--success) 0%, #059669 100%)'
    : 'linear-gradient(135deg, var(--warning) 0%, #d97706 100%)'};
  color: white;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--gray-500);
`;

export const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;

  &::after {
    content: '';
    width: 32px;
    height: 32px;
    border: 3px solid var(--gray-200);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
`;

export const StatCard = styled.div<{ $variant: 'pending' | 'completed' }>`
  padding: 20px;
  border-radius: 16px;
  background: ${props => props.$variant === 'completed'
    ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
    : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'};
  border: 1px solid ${props => props.$variant === 'completed' ? '#bbf7d0' : '#fde68a'};
`;

export const StatNumber = styled.div<{ $variant: 'pending' | 'completed' }>`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.$variant === 'completed' ? 'var(--success)' : 'var(--warning)'};
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: var(--gray-500);
  margin-top: 4px;
`;
