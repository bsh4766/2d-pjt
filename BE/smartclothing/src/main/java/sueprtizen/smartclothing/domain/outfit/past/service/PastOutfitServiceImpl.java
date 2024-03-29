package sueprtizen.smartclothing.domain.outfit.past.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sueprtizen.smartclothing.domain.calendar.exception.CalendarErrorCode;
import sueprtizen.smartclothing.domain.calendar.exception.CalendarException;
import sueprtizen.smartclothing.domain.clothing.entity.Clothing;
import sueprtizen.smartclothing.domain.outfit.past.dto.TodayClothingDTO;
import sueprtizen.smartclothing.domain.outfit.past.entity.PastOutfit;
import sueprtizen.smartclothing.domain.outfit.past.repository.PastOutfitRepository;
import sueprtizen.smartclothing.domain.users.entity.User;
import sueprtizen.smartclothing.domain.users.exception.UserErrorCode;
import sueprtizen.smartclothing.domain.users.exception.UserException;
import sueprtizen.smartclothing.domain.users.repository.UserRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PastOutfitServiceImpl implements PastOutfitService {
    final private UserRepository userRepository;
    final private PastOutfitRepository pastOutfitRepository;


    @Override
    public List<TodayClothingDTO> todayOutfitsConfirmation(int userId) {
        User currentUser = getUser(userId);

        List<PastOutfit> pastOutFitList = pastOutfitRepository.findAllBySchedule_UserAndSchedule_Date(
                currentUser, LocalDate.now()
        );

        if (pastOutFitList.isEmpty()) {
            throw new CalendarException(CalendarErrorCode.SCHEDULE_NOT_FOUND);
        }

        return pastOutFitList.stream().map(
                pastOutfit -> {
                    Clothing clothing = pastOutfit.getClothing();
                    return new TodayClothingDTO(
                            clothing.getOwnerId(), clothing.getClothingDetail().getClothingImgPath()
                    );
                }
        ).toList();
    }

    private User getUser(int userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException(UserErrorCode.NOT_FOUND_MEMBER));
    }
}
