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
import useDeleteSession from '../hooks/mutations/sessions/useDeleteSession';

export default function AuthenticatedOnly() {
  const { t } = useTranslation();
  const currentUser = useAuth();
  const location = useLocation();
  const match = useMatch('/rooms/:friendlyId');
  const deleteSession = useDeleteSession({ showToast: false });

  let logoutTimer;
  console.log('initialized logoutTimer');
  const startLogoutTimer = () => {
    console.log('startLogoutTimer called');
    // Set timeout for 10 minutes (600000 milliseconds)
    logoutTimer = setTimeout(() => {
        console.log('logoutTimer setTimeout');
        deleteSession.mutate();
	window.sessionStorage.setItem("ShowAlert", true);
    }, 60000);
};
  const resetLogoutTimer = () => {
    console.log('resetLogoutTimer called');
    clearTimeout(logoutTimer);
    startLogoutTimer();
  };
  useEffect(() => {
    console.log('useEffect called');
    // Start and reset the logout timer based on user activity
    if (currentUser.signed_in) {
        console.log('currentUser is signed in');
        startLogoutTimer();

        const events = ['mousemove', 'keydown', 'scroll', 'click'];
        console.log('adding events')
        events.forEach((event) => window.addEventListener(event, resetLogoutTimer));

        return () => {
            console.log('useEffect cleanup called');
            clearTimeout(logoutTimer);
            console.log('removing events');
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

