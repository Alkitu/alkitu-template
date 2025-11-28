// @ts-nocheck
// 
function stryNS_9fa48() {
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
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomBytes } from 'crypto';
@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  /**
   * Genera un token único de 32 caracteres
   */
  private generateToken(): string {
    if (stryMutAct_9fa48("24")) {
      {}
    } else {
      stryCov_9fa48("24");
      return randomBytes(32).toString(stryMutAct_9fa48("25") ? "" : (stryCov_9fa48("25"), 'hex'));
    }
  }

  /**
   * Crea un token de reset de contraseña
   */
  async createPasswordResetToken(email: string): Promise<string> {
    if (stryMutAct_9fa48("26")) {
      {}
    } else {
      stryCov_9fa48("26");
      const token = this.generateToken();
      const expires = new Date(stryMutAct_9fa48("27") ? Date.now() - 60 * 60 * 1000 : (stryCov_9fa48("27"), Date.now() + (stryMutAct_9fa48("28") ? 60 * 60 / 1000 : (stryCov_9fa48("28"), (stryMutAct_9fa48("29") ? 60 / 60 : (stryCov_9fa48("29"), 60 * 60)) * 1000)))); // 1 hora

      // Eliminar tokens existentes para este email
      await this.prisma.passwordResetToken.deleteMany(stryMutAct_9fa48("30") ? {} : (stryCov_9fa48("30"), {
        where: stryMutAct_9fa48("31") ? {} : (stryCov_9fa48("31"), {
          email
        })
      }));

      // Crear nuevo token
      await this.prisma.passwordResetToken.create(stryMutAct_9fa48("32") ? {} : (stryCov_9fa48("32"), {
        data: stryMutAct_9fa48("33") ? {} : (stryCov_9fa48("33"), {
          email,
          token,
          expires
        })
      }));
      return token;
    }
  }

  /**
   * Valida un token de reset de contraseña
   */
  async validatePasswordResetToken(token: string): Promise<{
    valid: boolean;
    email?: string;
  }> {
    if (stryMutAct_9fa48("34")) {
      {}
    } else {
      stryCov_9fa48("34");
      const tokenRecord = await this.prisma.passwordResetToken.findUnique(stryMutAct_9fa48("35") ? {} : (stryCov_9fa48("35"), {
        where: stryMutAct_9fa48("36") ? {} : (stryCov_9fa48("36"), {
          token
        })
      }));
      if (stryMutAct_9fa48("39") ? false : stryMutAct_9fa48("38") ? true : stryMutAct_9fa48("37") ? tokenRecord : (stryCov_9fa48("37", "38", "39"), !tokenRecord)) {
        if (stryMutAct_9fa48("40")) {
          {}
        } else {
          stryCov_9fa48("40");
          return stryMutAct_9fa48("41") ? {} : (stryCov_9fa48("41"), {
            valid: stryMutAct_9fa48("42") ? true : (stryCov_9fa48("42"), false)
          });
        }
      }
      if (stryMutAct_9fa48("46") ? tokenRecord.expires >= new Date() : stryMutAct_9fa48("45") ? tokenRecord.expires <= new Date() : stryMutAct_9fa48("44") ? false : stryMutAct_9fa48("43") ? true : (stryCov_9fa48("43", "44", "45", "46"), tokenRecord.expires < new Date())) {
        if (stryMutAct_9fa48("47")) {
          {}
        } else {
          stryCov_9fa48("47");
          // Token expirado, eliminar
          await this.prisma.passwordResetToken.delete(stryMutAct_9fa48("48") ? {} : (stryCov_9fa48("48"), {
            where: stryMutAct_9fa48("49") ? {} : (stryCov_9fa48("49"), {
              token
            })
          }));
          return stryMutAct_9fa48("50") ? {} : (stryCov_9fa48("50"), {
            valid: stryMutAct_9fa48("51") ? true : (stryCov_9fa48("51"), false)
          });
        }
      }
      return stryMutAct_9fa48("52") ? {} : (stryCov_9fa48("52"), {
        valid: stryMutAct_9fa48("53") ? false : (stryCov_9fa48("53"), true),
        email: tokenRecord.email
      });
    }
  }

  /**
   * Consume un token de reset de contraseña (lo elimina)
   */
  async consumePasswordResetToken(token: string): Promise<void> {
    if (stryMutAct_9fa48("54")) {
      {}
    } else {
      stryCov_9fa48("54");
      await this.prisma.passwordResetToken.delete(stryMutAct_9fa48("55") ? {} : (stryCov_9fa48("55"), {
        where: stryMutAct_9fa48("56") ? {} : (stryCov_9fa48("56"), {
          token
        })
      }));
    }
  }

  /**
   * Crea un token de verificación de email
   */
  async createEmailVerificationToken(email: string): Promise<string> {
    if (stryMutAct_9fa48("57")) {
      {}
    } else {
      stryCov_9fa48("57");
      const token = this.generateToken();
      const expires = new Date(stryMutAct_9fa48("58") ? Date.now() - 24 * 60 * 60 * 1000 : (stryCov_9fa48("58"), Date.now() + (stryMutAct_9fa48("59") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("59"), (stryMutAct_9fa48("60") ? 24 * 60 / 60 : (stryCov_9fa48("60"), (stryMutAct_9fa48("61") ? 24 / 60 : (stryCov_9fa48("61"), 24 * 60)) * 60)) * 1000)))); // 24 horas

      // Eliminar tokens existentes para este email
      await this.prisma.verificationToken.deleteMany(stryMutAct_9fa48("62") ? {} : (stryCov_9fa48("62"), {
        where: stryMutAct_9fa48("63") ? {} : (stryCov_9fa48("63"), {
          identifier: email
        })
      }));

      // Crear nuevo token
      await this.prisma.verificationToken.create(stryMutAct_9fa48("64") ? {} : (stryCov_9fa48("64"), {
        data: stryMutAct_9fa48("65") ? {} : (stryCov_9fa48("65"), {
          identifier: email,
          token,
          expires
        })
      }));
      return token;
    }
  }

  /**
   * Valida un token de verificación de email
   */
  async validateEmailVerificationToken(token: string): Promise<{
    valid: boolean;
    email?: string;
  }> {
    if (stryMutAct_9fa48("66")) {
      {}
    } else {
      stryCov_9fa48("66");
      const tokenRecord = await this.prisma.verificationToken.findUnique(stryMutAct_9fa48("67") ? {} : (stryCov_9fa48("67"), {
        where: stryMutAct_9fa48("68") ? {} : (stryCov_9fa48("68"), {
          token
        })
      }));
      if (stryMutAct_9fa48("71") ? false : stryMutAct_9fa48("70") ? true : stryMutAct_9fa48("69") ? tokenRecord : (stryCov_9fa48("69", "70", "71"), !tokenRecord)) {
        if (stryMutAct_9fa48("72")) {
          {}
        } else {
          stryCov_9fa48("72");
          return stryMutAct_9fa48("73") ? {} : (stryCov_9fa48("73"), {
            valid: stryMutAct_9fa48("74") ? true : (stryCov_9fa48("74"), false)
          });
        }
      }
      if (stryMutAct_9fa48("78") ? tokenRecord.expires >= new Date() : stryMutAct_9fa48("77") ? tokenRecord.expires <= new Date() : stryMutAct_9fa48("76") ? false : stryMutAct_9fa48("75") ? true : (stryCov_9fa48("75", "76", "77", "78"), tokenRecord.expires < new Date())) {
        if (stryMutAct_9fa48("79")) {
          {}
        } else {
          stryCov_9fa48("79");
          // Token expirado, eliminar
          await this.prisma.verificationToken.delete(stryMutAct_9fa48("80") ? {} : (stryCov_9fa48("80"), {
            where: stryMutAct_9fa48("81") ? {} : (stryCov_9fa48("81"), {
              token
            })
          }));
          return stryMutAct_9fa48("82") ? {} : (stryCov_9fa48("82"), {
            valid: stryMutAct_9fa48("83") ? true : (stryCov_9fa48("83"), false)
          });
        }
      }
      return stryMutAct_9fa48("84") ? {} : (stryCov_9fa48("84"), {
        valid: stryMutAct_9fa48("85") ? false : (stryCov_9fa48("85"), true),
        email: tokenRecord.identifier
      });
    }
  }

  /**
   * Consume un token de verificación de email (lo elimina)
   */
  async consumeEmailVerificationToken(token: string): Promise<void> {
    if (stryMutAct_9fa48("86")) {
      {}
    } else {
      stryCov_9fa48("86");
      await this.prisma.verificationToken.delete(stryMutAct_9fa48("87") ? {} : (stryCov_9fa48("87"), {
        where: stryMutAct_9fa48("88") ? {} : (stryCov_9fa48("88"), {
          token
        })
      }));
    }
  }

  /**
   * Limpia tokens expirados (para ejecutar periódicamente)
   */
  /**
   * Crea un token de refresco
   */
  async createRefreshToken(userId: string): Promise<string> {
    if (stryMutAct_9fa48("89")) {
      {}
    } else {
      stryCov_9fa48("89");
      const token = this.generateToken();
      const expires = new Date(stryMutAct_9fa48("90") ? Date.now() - 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("90"), Date.now() + (stryMutAct_9fa48("91") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("91"), (stryMutAct_9fa48("92") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("92"), (stryMutAct_9fa48("93") ? 7 * 24 / 60 : (stryCov_9fa48("93"), (stryMutAct_9fa48("94") ? 7 / 24 : (stryCov_9fa48("94"), 7 * 24)) * 60)) * 60)) * 1000)))); // 7 días

      await this.prisma.refreshToken.create(stryMutAct_9fa48("95") ? {} : (stryCov_9fa48("95"), {
        data: stryMutAct_9fa48("96") ? {} : (stryCov_9fa48("96"), {
          userId,
          token,
          expires
        })
      }));
      return token;
    }
  }

  /**
   * Valida un token de refresco
   */
  async validateRefreshToken(token: string): Promise<{
    valid: boolean;
    userId?: string;
  }> {
    if (stryMutAct_9fa48("97")) {
      {}
    } else {
      stryCov_9fa48("97");
      const tokenRecord = await this.prisma.refreshToken.findUnique(stryMutAct_9fa48("98") ? {} : (stryCov_9fa48("98"), {
        where: stryMutAct_9fa48("99") ? {} : (stryCov_9fa48("99"), {
          token
        })
      }));
      if (stryMutAct_9fa48("102") ? false : stryMutAct_9fa48("101") ? true : stryMutAct_9fa48("100") ? tokenRecord : (stryCov_9fa48("100", "101", "102"), !tokenRecord)) {
        if (stryMutAct_9fa48("103")) {
          {}
        } else {
          stryCov_9fa48("103");
          return stryMutAct_9fa48("104") ? {} : (stryCov_9fa48("104"), {
            valid: stryMutAct_9fa48("105") ? true : (stryCov_9fa48("105"), false)
          });
        }
      }
      if (stryMutAct_9fa48("109") ? tokenRecord.expires >= new Date() : stryMutAct_9fa48("108") ? tokenRecord.expires <= new Date() : stryMutAct_9fa48("107") ? false : stryMutAct_9fa48("106") ? true : (stryCov_9fa48("106", "107", "108", "109"), tokenRecord.expires < new Date())) {
        if (stryMutAct_9fa48("110")) {
          {}
        } else {
          stryCov_9fa48("110");
          // Token expirado, eliminar
          await this.prisma.refreshToken.delete(stryMutAct_9fa48("111") ? {} : (stryCov_9fa48("111"), {
            where: stryMutAct_9fa48("112") ? {} : (stryCov_9fa48("112"), {
              token
            })
          }));
          return stryMutAct_9fa48("113") ? {} : (stryCov_9fa48("113"), {
            valid: stryMutAct_9fa48("114") ? true : (stryCov_9fa48("114"), false)
          });
        }
      }
      return stryMutAct_9fa48("115") ? {} : (stryCov_9fa48("115"), {
        valid: stryMutAct_9fa48("116") ? false : (stryCov_9fa48("116"), true),
        userId: tokenRecord.userId
      });
    }
  }

  /**
   * Consume un token de refresco (lo elimina)
   */
  async consumeRefreshToken(token: string): Promise<void> {
    if (stryMutAct_9fa48("117")) {
      {}
    } else {
      stryCov_9fa48("117");
      await this.prisma.refreshToken.delete(stryMutAct_9fa48("118") ? {} : (stryCov_9fa48("118"), {
        where: stryMutAct_9fa48("119") ? {} : (stryCov_9fa48("119"), {
          token
        })
      }));
    }
  }

  /**
   * Encuentra un token de refresco por su valor
   */
  async findRefreshToken(token: string) {
    if (stryMutAct_9fa48("120")) {
      {}
    } else {
      stryCov_9fa48("120");
      return this.prisma.refreshToken.findUnique(stryMutAct_9fa48("121") ? {} : (stryCov_9fa48("121"), {
        where: stryMutAct_9fa48("122") ? {} : (stryCov_9fa48("122"), {
          token
        })
      }));
    }
  }

  /**
   * Verifica si un usuario tiene refresh tokens válidos
   * Útil para validar si las sesiones del usuario han sido revocadas
   */
  async userHasValidRefreshTokens(userId: string): Promise<boolean> {
    if (stryMutAct_9fa48("123")) {
      {}
    } else {
      stryCov_9fa48("123");
      const validTokenCount = await this.prisma.refreshToken.count(stryMutAct_9fa48("124") ? {} : (stryCov_9fa48("124"), {
        where: stryMutAct_9fa48("125") ? {} : (stryCov_9fa48("125"), {
          userId,
          expires: stryMutAct_9fa48("126") ? {} : (stryCov_9fa48("126"), {
            gt: new Date()
          }) // Solo tokens no expirados
        })
      }));
      return stryMutAct_9fa48("130") ? validTokenCount <= 0 : stryMutAct_9fa48("129") ? validTokenCount >= 0 : stryMutAct_9fa48("128") ? false : stryMutAct_9fa48("127") ? true : (stryCov_9fa48("127", "128", "129", "130"), validTokenCount > 0);
    }
  }

  /**
   * Revoca todas las sesiones de un usuario (elimina todos sus refresh tokens)
   */
  async revokeAllUserSessions(userId: string): Promise<number> {
    if (stryMutAct_9fa48("131")) {
      {}
    } else {
      stryCov_9fa48("131");
      const result = await this.prisma.refreshToken.deleteMany(stryMutAct_9fa48("132") ? {} : (stryCov_9fa48("132"), {
        where: stryMutAct_9fa48("133") ? {} : (stryCov_9fa48("133"), {
          userId
        })
      }));
      return result.count;
    }
  }

  /**
   * Revoca todas las sesiones de todos los usuarios (elimina todos los refresh tokens)
   */
  async revokeAllSessions(): Promise<number> {
    if (stryMutAct_9fa48("134")) {
      {}
    } else {
      stryCov_9fa48("134");
      const result = await this.prisma.refreshToken.deleteMany({});
      return result.count;
    }
  }

  /**
   * Limpia tokens expirados (para ejecutar periódicamente)
   */
  async cleanExpiredTokens(): Promise<{
    passwordResetTokens: number;
    verificationTokens: number;
    refreshTokens: number;
  }> {
    if (stryMutAct_9fa48("135")) {
      {}
    } else {
      stryCov_9fa48("135");
      const now = new Date();
      const [passwordResetCount, verificationCount, refreshCount] = await Promise.all(stryMutAct_9fa48("136") ? [] : (stryCov_9fa48("136"), [this.prisma.passwordResetToken.deleteMany(stryMutAct_9fa48("137") ? {} : (stryCov_9fa48("137"), {
        where: stryMutAct_9fa48("138") ? {} : (stryCov_9fa48("138"), {
          expires: stryMutAct_9fa48("139") ? {} : (stryCov_9fa48("139"), {
            lt: now
          })
        })
      })), this.prisma.verificationToken.deleteMany(stryMutAct_9fa48("140") ? {} : (stryCov_9fa48("140"), {
        where: stryMutAct_9fa48("141") ? {} : (stryCov_9fa48("141"), {
          expires: stryMutAct_9fa48("142") ? {} : (stryCov_9fa48("142"), {
            lt: now
          })
        })
      })), this.prisma.refreshToken.deleteMany(stryMutAct_9fa48("143") ? {} : (stryCov_9fa48("143"), {
        where: stryMutAct_9fa48("144") ? {} : (stryCov_9fa48("144"), {
          expires: stryMutAct_9fa48("145") ? {} : (stryCov_9fa48("145"), {
            lt: now
          })
        })
      }))]));
      return stryMutAct_9fa48("146") ? {} : (stryCov_9fa48("146"), {
        passwordResetTokens: passwordResetCount.count,
        verificationTokens: verificationCount.count,
        refreshTokens: refreshCount.count
      });
    }
  }
}