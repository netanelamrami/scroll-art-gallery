// This file is now deprecated in favor of AuthContext
// Import useMultiUserAuth from @/contexts/AuthContext instead

import { useContext } from 'react';

export const useMultiUserAuth = () => {
  throw new Error('useMultiUserAuth from hooks is deprecated. Import from @/contexts/AuthContext instead');
};