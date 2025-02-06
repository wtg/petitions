export interface OAuthProfile {
    sub: string,
    name: string,
    preferred_username: string,
    given_name: string,
    family_name: string,
    email: string,
}

export interface Profile {
    id: string,
    rcsid: string,
    initials?: string,
}