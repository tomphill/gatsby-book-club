import styled from 'styled-components'

export const Button = styled.button`
  padding: 8px 16px;
  background: rebeccapurple;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  ${props => props.block ? 'display: block; width: 100%;' : ''}
  
  &:hover{
    background: indigo;
  }
`