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
 
import React from 'react';
import { Container } from 'react-bootstrap';
import useSiteSetting from '../../hooks/queries/site_settings/useSiteSetting';
 
export default function Banner() {
  const { data: siteSetting } = useSiteSetting(['Banner']);
  const ShowBanner = (window.sessionStorage.getItem("ShowBanner") ? JSON.parse(window.sessionStorage.getItem("ShowBanner")): true );
  const [showAlert, setShowAlert] = React.useState(ShowBanner);

  console.log({siteSetting});
  return (
  <>
    {showAlert && siteSetting !== "" && <div className ="alert alert-info alert-dismissible text-center mb-0" role="alert">
    {siteSetting}
      <button type="button" className="close" data-dismiss="alert" aria-label="Close"
      onClick={() => {
          setShowAlert(false);
          window.sessionStorage.setItem("ShowBanner", false);
          }}>
      <span aria-hidden="true">&times;</span>
      </button>
      </div>
      }
    </>

  );

}
