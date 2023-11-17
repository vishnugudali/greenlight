// BigBlueButton open source conferencing system - http://www.bigbluebutton.org/.
//
// Copyright (c) 2022 BigBlueButton Inc. and by respective authors (see below).
//
// This program is free software; you can redistribute it and/or modify it under the
// terms of the GNU Lesser General Public License as published by the Free Software
// Foundation; either version 3.0 of the License, or (at your option) any later
// version.
//
// Greenlight is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License along
// with Greenlight; if not, see <http://www.gnu.org/licenses/>.

import React, { useEffect } from 'react';
import {
  Navigate, Outlet, useLocation, useMatch,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/auth/AuthProvider';
import { useSession } from '../contexts/auth/SessionContext';
import useDeleteSession from '../hooks/mutations/sessions/useDeleteSession';

export default function AuthenticatedOnly() {
  const { t } = useTranslation();
  const currentUser = useAuth();
  const location = useLocation();
  const match = useMatch('/rooms/:friendlyId');
  const deleteSession = useDeleteSession({ showToast: false });
  const { triggerSessionExpiry } = useSession();

  let logoutTimer;
  const startLogoutTimer = () => {
    logoutTimer = setTimeout(() => {
        deleteSession.mutate();
        triggerSessionExpiry();
    }, 600000); // 10 minutes
};
  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer);
    startLogoutTimer();
  };

  useEffect(() => {
    // Start and reset the logout timer based on user activity
    if (currentUser.signed_in) {
        startLogoutTimer();

        const events = ['mousemove', 'keydown', 'scroll', 'click'];
        events.forEach((event) => window.addEventListener(event, resetLogoutTimer));

        return () => {
            clearTimeout(logoutTimer);
            events.forEach((event) => window.removeEventListener(event, resetLogoutTimer));
        };
    }
}, [currentUser]);
  // User is either pending or banned
  if (currentUser.signed_in && (currentUser.status !== 'active' || !currentUser.verified)) {
    deleteSession.mutate();

    if (currentUser.status === 'pending') {
      toast.error(t('toast.error.users.pending'));
    } else if (currentUser.status === 'banned') {
      toast.error(t('toast.error.users.banned'));
    } else {
      toast.error(t('toast.error.signin_required'));
    }
  }

  // Custom logic to redirect from Rooms page to join page if the user isn't signed in
  if (!currentUser.signed_in && match) {
    return <Navigate to={`${location.pathname}/join`} />;
  }

  if (!currentUser.signed_in) {
    toast.error(t('toast.error.signin_required'));
    return <Navigate to="/" />;
  }


  return <Outlet />;
}

