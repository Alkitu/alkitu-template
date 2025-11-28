/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck

// 

/* eslint-disable @typescript-eslint/no-unsafe-member-access */function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    if (stryMutAct_9fa48("0")) {
      {}
    } else {
      stryCov_9fa48("0");
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(stryMutAct_9fa48("1") ? "" : (stryCov_9fa48("1"), 'roles'), stryMutAct_9fa48("2") ? [] : (stryCov_9fa48("2"), [context.getHandler(), context.getClass()]));
      if (stryMutAct_9fa48("5") ? false : stryMutAct_9fa48("4") ? true : stryMutAct_9fa48("3") ? requiredRoles : (stryCov_9fa48("3", "4", "5"), !requiredRoles)) {
        if (stryMutAct_9fa48("6")) {
          {}
        } else {
          stryCov_9fa48("6");
          return stryMutAct_9fa48("7") ? false : (stryCov_9fa48("7"), true); // No roles specified, allow access
        }
      }
      const {
        user
      } = context.switchToHttp().getRequest();
      console.log(stryMutAct_9fa48("8") ? "" : (stryCov_9fa48("8"), 'RolesGuard - User object:'), user);
      console.log(stryMutAct_9fa48("9") ? "" : (stryCov_9fa48("9"), 'RolesGuard - User role:'), stryMutAct_9fa48("10") ? user.role : (stryCov_9fa48("10"), user?.role));
      if (stryMutAct_9fa48("13") ? !user && !user.role : stryMutAct_9fa48("12") ? false : stryMutAct_9fa48("11") ? true : (stryCov_9fa48("11", "12", "13"), (stryMutAct_9fa48("14") ? user : (stryCov_9fa48("14"), !user)) || (stryMutAct_9fa48("15") ? user.role : (stryCov_9fa48("15"), !user.role)))) {
        if (stryMutAct_9fa48("16")) {
          {}
        } else {
          stryCov_9fa48("16");
          console.log(stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), 'RolesGuard - User or role is undefined, denying access'));
          return stryMutAct_9fa48("18") ? true : (stryCov_9fa48("18"), false);
        }
      }
      return stryMutAct_9fa48("19") ? requiredRoles.every(role => user.role === role) : (stryCov_9fa48("19"), requiredRoles.some(stryMutAct_9fa48("20") ? () => undefined : (stryCov_9fa48("20"), role => stryMutAct_9fa48("23") ? user.role !== role : stryMutAct_9fa48("22") ? false : stryMutAct_9fa48("21") ? true : (stryCov_9fa48("21", "22", "23"), user.role === role))));
    }
  }
}