import { UserTrophiesDao } from "@orm/dao/UserTrophiesDao";

class UserTrophiesService {
    private userTrophiesDao = new UserTrophiesDao();
}

export const userTrophiesService = new UserTrophiesService();