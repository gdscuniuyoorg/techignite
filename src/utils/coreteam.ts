/**
 * Outgoing GDGOC UNIUYO CoreTeam (25/26 session).
 *
 * Every photo in `public/organizers/` is represented here by a web-optimised
 * copy in `public/organizers/optimized/` (resized + EXIF-stripped). Edidiong
 * Samuel, Uwakmfon Ekong, and Borngreat Ikwutah have confirmed names/titles;
 * the remaining names are derived from the source filenames and can be
 * corrected in this file alone.
 */
export interface CoreTeamMember {
  readonly name: string;
  readonly role?: string;
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export const outgoingCoreTeam: readonly CoreTeamMember[] = [
  {
    name: 'Edidiong Samuel',
    role: 'Outgoing Convener, 25/26 Session',
    src: '/organizers/optimized/edidiong-samuel.jpg',
    alt: 'Edidiong Samuel, Outgoing Convener of the GDGOC UNIUYO 25/26 Session',
    width: 750,
    height: 1000,
  },
  {
    name: 'Bernard Itoro',
    src: '/organizers/optimized/bernard-itoro.jpg',
    alt: 'Bernard Itoro, outgoing GDGOC UNIUYO CoreTeam member',
    width: 1000,
    height: 1000,
  },
  {
    name: 'Ceetoh',
    src: '/organizers/optimized/ceetoh.jpg',
    alt: 'Ceetoh, outgoing GDGOC UNIUYO CoreTeam member',
    width: 834,
    height: 1000,
  },
  {
    name: 'DeeJhay',
    src: '/organizers/optimized/deejhay.jpg',
    alt: 'DeeJhay, outgoing GDGOC UNIUYO CoreTeam member',
    width: 706,
    height: 628,
  },
  {
    name: 'Effiong Divine',
    src: '/organizers/optimized/effiong-divine.jpg',
    alt: 'Effiong Divine, outgoing GDGOC UNIUYO CoreTeam member',
    width: 1000,
    height: 1000,
  },
  {
    name: 'Emediong',
    src: '/organizers/optimized/emediong.jpg',
    alt: 'Emediong, outgoing GDGOC UNIUYO CoreTeam member',
    width: 753,
    height: 1000,
  },
  {
    name: 'Gideon Jones',
    src: '/organizers/optimized/gideon-jones.jpg',
    alt: 'Gideon Jones, outgoing GDGOC UNIUYO CoreTeam member',
    width: 698,
    height: 667,
  },
  {
    name: 'Mfoniso Ibokette',
    src: '/organizers/optimized/mfoniso-ibokette.jpg',
    alt: 'Mfoniso Ibokette, outgoing GDGOC UNIUYO CoreTeam member',
    width: 800,
    height: 1000,
  },
  {
    name: 'OGoluwa',
    src: '/organizers/optimized/ogoluwa.jpg',
    alt: 'OGoluwa, outgoing GDGOC UNIUYO CoreTeam member',
    width: 1000,
    height: 1000,
  },
  {
    name: 'Thanhiela',
    src: '/organizers/optimized/thanhiela.jpg',
    alt: 'Thanhiela, outgoing GDGOC UNIUYO CoreTeam member',
    width: 965,
    height: 1000,
  },
  {
    name: 'Uwakmfon Ekong',
    role: 'Assistant Convener',
    src: '/organizers/optimized/uwakmfon-ekong.jpg',
    alt: 'Uwakmfon Ekong, outgoing GDGOC UNIUYO CoreTeam member',
    width: 667,
    height: 1000,
  },
  {
    name: 'Borngreat Ikwutah',
    role: 'Devlead',
    src: '/organizers/optimized/borngreat-ikwutah.jpg',
    alt: 'Borngreat Ikwutah, Devlead of the outgoing GDGOC UNIUYO CoreTeam',
    width: 958,
    height: 1000,
  },
];
