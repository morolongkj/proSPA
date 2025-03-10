import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiService } from '../_services/api.service';

export const userDetailsResolver: ResolveFn<boolean> = (route, state) => {
  const userId = route.paramMap.get('id'); // Get the user id from the route parameters
  if (userId) {
    return inject(ApiService).get('users/' + userId); // Call the service method to get the user by id
  }
  return false; // Or handle the case where no user id is found
};
